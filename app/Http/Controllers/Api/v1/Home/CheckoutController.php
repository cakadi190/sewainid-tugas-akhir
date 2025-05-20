<?php

namespace App\Http\Controllers\Api\v1\Home;

use App\Enums\RentalStatusEnum;
use App\Enums\TransactionStatusEnum;
use App\Helpers\TripayHelper;
use App\Http\Controllers\Controller;
use App\Models\CarData;
use App\Models\Transaction;
use App\Models\User;
use App\TransferObjects\Tripay\TripayCustomerData;
use App\TransferObjects\Tripay\TripayOrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Session\Store;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use sirajcse\UniqueIdGenerator\UniqueIdGenerator;

/**
 * Mengelola proses checkout rental mobil
 */
class CheckoutController extends Controller
{
    public function __construct(
        protected readonly CarData $carData,
        protected readonly Transaction $transaction,
        protected readonly Store $session,
        protected readonly TripayHelper $tripay
    ) {
    }

    /**
     * Menambah atau mengupdate data rental dalam session
     */
    public function addOrUpdate(Request $request)
    {
        $isUpdate = $request->boolean('update');
        $hasOrder = $this->session->has('order');

        if (!$isUpdate && $hasOrder) {
            throw ValidationException::withMessages([
                'order' => 'Anda sudah memiliki order. ERR_ALREADY_HAVE_ORDER',
            ]);
        }

        $validated = $request->validate([
            'car_id' => 'required|exists:car_data,id',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date',
            'with_driver' => 'nullable|boolean',
        ]);

        /** @var CarData $carData */
        $carData = $this->carData->findOrFail($validated['car_id']);

        if (!$carData->isNotOnUnavailableDate($validated['pickup_date']) || !$carData->isNotOnUnavailableDate($validated['return_date'])) {
            throw ValidationException::withMessages([
                'order' => 'Tanggal tidak tersedia. ERR_FORBIDDEN_DATE',
            ]);
        }

        $this->session->put('order', $validated);

        return redirect()->route('checkout');
    }

    /**
     * Proses checkout: buat transaksi dan integrasi dengan Tripay
     */
    public function checkout(Request $request)
    {
        $order = $this->session->get('order');

        abort_unless($order, 422, 'You have no order! ERR_NO_ORDER');

        $validated = $request->validate([
            'destination_latitude' => 'required|numeric',
            'destination_longitude' => 'required|numeric',
            'destination_name' => 'required|string',
            'destination_address' => 'required|string',
            'payment_method' => 'required|string',
            'agree_terms' => 'accepted',
        ]);

        DB::beginTransaction();

        try {
            /** @var User $user */
            $user = auth()->user();

            // Gunakan for update untuk locking data mobil
            /** @var CarData $car */
            $car = $this->carData->where('id', $order['car_id'])->lockForUpdate()->first();

            if (!$car) {
                throw ValidationException::withMessages([
                    'order' => 'Mobil tidak ditemukan. ERR_CAR_NOT_FOUND',
                ]);
            }

            // Validasi ulang tanggal rental (antisipasi race condition)
            if (!$car->isNotOnUnavailableDate($order['pickup_date']) || !$car->isNotOnUnavailableDate($order['return_date'])) {
                throw ValidationException::withMessages([
                    'order' => 'Tanggal tidak tersedia. ERR_FORBIDDEN_DATE',
                ]);
            }

            $rentDays = Carbon::parse($order['pickup_date'])->diffInDays(Carbon::parse($order['return_date']));
            $trxId = $this->generateTransactionId();

            // Build item dan hitung total harga
            $items = $this->buildOrderItems($car, $rentDays, $order['with_driver'] ?? false, $trxId);
            $tax = $this->calculateTax($items);

            $items->push(new TripayOrderItem(
                sku: "TAX-{$car->id}-{$trxId}",
                name: "Pajak Biaya Rental",
                price: $tax,
                quantity: 1,
            ));

            // Hitung total pembayaran
            $totalPay = $items->sum(fn($item) => $item->price * $item->quantity);

            // Request ke Tripay
            $response = $this->tripay->requestPayment(
                method: $validated['payment_method'],
                customerData: new TripayCustomerData($user->name, $user->email, $user->phone),
                trxId: $trxId,
                items: $items->toArray(),
            );

            if ($response->failed()) {
                throw new \Exception($response->json()['message'] ?? 'Gagal memproses pembayaran.');
            }

            $dataResponse = $response->json();

            // Simpan transaksi
            $this->transaction->create([
                'id' => $trxId,
                'status' => TransactionStatusEnum::UNPAID,
                'rental_status' => RentalStatusEnum::DRAFT,
                'confirmed_at' => null,
                'payment_channel' => $validated['payment_method'],
                'payment_references' => $dataResponse['data']['reference'],
                'expired_at' => now()->addHours(2),
                'total_price' => $car->rent_price + $tax,
                'total_pay' => $totalPay,
                'pickup_date' => Carbon::parse($order['pickup_date']),
                'return_date' => Carbon::parse($order['return_date']),
                'place_name' => $validated['destination_name'],
                'with_driver' => $order['with_driver'] ?? false,
                'longitude' => $validated['destination_longitude'],
                'latitude' => $validated['destination_latitude'],
                'user_id' => $user->id,
                'car_data_id' => $car->id,
            ]);

            // Hapus session dan commit transaksi
            $this->session->forget('order');
            DB::commit();

            return response()->json(['message' => 'Checkout success.'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            return back()->with('error', $th->getMessage());
        }
    }

    /**
     * Generate ID unik transaksi
     */
    protected function generateTransactionId(): string
    {
        return UniqueIdGenerator::generate([
            'table' => (new Transaction)->getTable(),
            'length' => 10,
            'prefix' => 'INV-',
            'suffix' => date('y'),
        ]);
    }

    /**
     * Hitung pajak sebesar 11%
     */
    protected function calculateTax($items): float
    {
        return $items->sum(fn($item) => $item->price * $item->quantity) * 0.11;
    }

    /**
     * Buat list item pesanan yang akan dikirim ke Tripay
     */
    protected function buildOrderItems(CarData $car, int $rentDays, bool $withDriver, string $trxId)
    {
        $items = collect([
            new TripayOrderItem(
                sku: $car->id,
                name: "Rental {$car->fullName}",
                price: $car->rent_price,
                quantity: $rentDays,
                product_url: route('armada.show', $car->slug),
                image_url: $car->getFirstMediaUrl('images'),
            ),
            new TripayOrderItem(
                name: "Biaya Operasional Layanan",
                price: 50000,
                quantity: 1,
            ),
        ]);

        if ($withDriver) {
            $items->push(new TripayOrderItem(
                sku: "DRIVER-{$car->id}-{$trxId}",
                name: "Biaya Driver Rental",
                price: 250000,
                quantity: $rentDays,
            ));
        }

        return $items;
    }
}
