<?php

namespace App\Http\Controllers\Api\v1\Home;

use App\Enums\RentalStatusEnum;
use App\Enums\TransactionStatusEnum;
use App\Services\TripayServices;
use App\Http\Controllers\Controller;
use App\Models\CarData;
use App\Models\Transaction;
use App\Models\User;
use App\Services\FonnteService;
use App\TransferObjects\Tripay\TripayCustomerData;
use App\TransferObjects\Tripay\TripayOrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Session\Store;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Log;
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
        protected readonly TripayServices $tripay,
        protected readonly FonnteService $fonnte
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

            /** @var CarData $car */
            $car = $this->carData->where('id', $order['car_id'])->lockForUpdate()->first();

            if (!$car) {
                throw ValidationException::withMessages([
                    'order' => 'Mobil tidak ditemukan. ERR_CAR_NOT_FOUND',
                ]);
            }

            if (!$car->isNotOnUnavailableDate($order['pickup_date']) || !$car->isNotOnUnavailableDate($order['return_date'])) {
                throw ValidationException::withMessages([
                    'order' => 'Tanggal tidak tersedia. ERR_FORBIDDEN_DATE',
                ]);
            }

            $rentDays = Carbon::parse($order['pickup_date'])->diffInDays(Carbon::parse($order['return_date']));
            $trxId = $this->generateTransactionId();
            $items = $this->buildOrderItems($car, $rentDays, $order['with_driver'] ?? false, $trxId);
            $tax = $this->calculateTax($items);

            $items->push(new TripayOrderItem(
                sku: "TAX-{$car->id}-{$trxId}",
                name: "Pajak Biaya Rental",
                price: $tax,
                quantity: 1,
            ));

            $totalPay = $items->sum(fn($item) => $item->price * $item->quantity);

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

            /** @var null|Transaction|bool $transaction */
            $transaction = $this->transaction->create([
                'id' => $trxId,
                'status' => TransactionStatusEnum::UNPAID,
                'rental_status' => RentalStatusEnum::DRAFT,
                'confirmed_at' => null,
                'payment_channel' => $validated['payment_method'],
                'payment_references' => $dataResponse['data']['reference'],
                'expired_at' => now()->addHours(2)->setTimezone('UTC'),
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

            $this->sendWhatsappMessage($transaction);

            $this->cleanUpSessionAndWishlist();

            DB::commit();

            return redirect()->route('dashboard.transaction.show', $transaction->id);
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            return back()->with('error', $th->getMessage());
        }
    }

    /**
     * Send a WhatsApp message to the user containing the transaction
     * id, amount, and a link to the transaction detail page.
     *
     * @param Transaction $transaction
     */
    protected function sendWhatsappMessage(Transaction $transaction): void
    {
        $user = auth()->user();

        if (!$user || !$user->phone) {
            Log::warning('WhatsApp message not sent: User not authenticated or phone number missing.');
            return;
        }

        $expiredDate = $transaction->expired_at
            ? Carbon::parse($transaction->expired_at)
                ->setTimezone('Asia/Jakarta')
                ->locale('id_ID')
                ->isoFormat('d F Y, H:i')
            : null;

        $formattedPrice = number_format($transaction->total_pay, 0, ',', '.');
        $url = route('dashboard.transaction.show', $transaction->id);

        $rawPhone = preg_replace('/[^0-9]/', '', $user->phone);
        $phoneNumber = '62' . ltrim($rawPhone, '0');

        $message = <<<MSG
Hai {$user->name}!

Kamu punya tagihan *#{$transaction->id}* sebesar *Rp{$formattedPrice}*. Detailnya ada di {$url}. Tolong bayar sebelum *{$expiredDate}* WIB ya!

~ Salam,
Tim Sewain By Kodinus.

> Kalo ini bukan kamu yang pesan, segera lapor ke kami lewat pesan ini dan kami akan tindak lanjuti supaya datamu aman dan tidak disalahgunakan!
MSG;

        try {
            $this->fonnte->message($message, $phoneNumber)
                ->typing()
                ->send();
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Cleans up the session order and removes the associated car from the user's wishlist.
     *
     * This method retrieves the current order from the session and deletes the
     * corresponding car data from the authenticated user's wishlist. It then
     * clears the order from the session.
     *
     * @return void
     */
    protected function cleanUpSessionAndWishlist(): void
    {
        $session = $this->session->get('order');

        auth()->user()->wishlists()->where('car_data_id', $session['car_id'])->delete();

        $this->session->forget('order');
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
