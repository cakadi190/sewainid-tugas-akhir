<?php

namespace App\Services;

use App\TransferObjects\Tripay\TripayCustomerData;
use App\TransferObjects\Tripay\TripayOrderItem;
use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class TripayServices
{
    protected readonly ?string $merchantCode;
    protected readonly ?string $apiKey;
    protected readonly ?string $privateKey;
    protected readonly ?bool $mode;

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->merchantCode = config('services.tripay.merchant_code');
        $this->apiKey = config('services.tripay.api_key');
        $this->privateKey = config('services.tripay.private_key');
        $this->mode = config('services.tripay.mode') === 'development';
    }

    /**
     * Retrieve payment channels from the Tripay API and optionally filter them by a search term.
     *
     * @param  string|null  $search  Optional search term to filter payment channels by name.
     * @return \Illuminate\Support\Collection A collection of payment channels, filtered by the search term if provided.
     *
     * @throws \Illuminate\Http\Client\RequestException If the HTTP request fails.
     */
    public function getChannels(?string $search = null): \Illuminate\Support\Collection
    {
        $response = $this->fetch('merchant/payment-channel');

        $response->throw();

        return collect($response->json()['data'])
            ->when($search, fn ($collection) => $collection->filter(fn ($item) => Str::contains(strtolower($item['name']), strtolower($search)) || Str::contains(strtolower($item['code']), strtolower($search))));
    }

    /**
     * Send a payment request to the Tripay API.
     *
     * @param  string  $method  The payment method to use.
     * @param  string  $trxId  The transaction ID.
     * @param  TripayCustomerData  $customerData  The customer data.
     * @param  TripayOrderItem[]  $items  The items to be paid.
     * @return Response The response from the Tripay API.
     *
     * @throws \Illuminate\Http\Client\RequestException If the HTTP request fails.
     */
    public function requestPayment(string $method, string $trxId, TripayCustomerData $customerData, array $items)
    {
        $amount = collect($items)->sum(fn ($item) => $item->price * $item->quantity);
        $sign = hash_hmac('sha256', "{$this->merchantCode}{$trxId}{$amount}", $this->privateKey);
        $expired = time() + 2 * 60 * 60;

        return $this->fetch('transaction/create', [
            'method' => $method,
            'amount' => $amount,
            'merchant_ref' => $trxId,
            'customer_name' => $customerData->name,
            'customer_email' => $customerData->email,
            'customer_phone' => $customerData->phone,
            'order_items' => $items,
            'return_url' => url("/transactions/{$trxId}"),
            'expired' => $expired,
            'signature' => $sign,
        ], method: 'POST');
    }

    /**
     * Retrieve a payment status from the Tripay API by reference.
     *
     * @param  string  $ref  The transaction reference from the Tripay API.
     * @return Response The response from the Tripay API.
     *
     * @throws Exception If the transaction reference is empty.
     */
    public function getPayment(string $ref)
    {
        if (empty($ref)) {
            throw new Exception('Transaction reference is required');
        }

        return $this->fetch('transaction/detail', params: ['reference' => $ref], method: 'GET');
    }

    /**
     * Setup base URL berdasarkan mode
     */
    private function setupBaseUrl(?string $url = null): string
    {
        return ($this->mode ? 'https://tripay.co.id/api-sandbox/' : 'https://tripay.co.id/api/') . trim($url, '/');
    }

    /**
     * Melakukan request ke API Tripay
     */
    private function fetch(?string $url = null, ?array $params = null, ?string $method = 'GET'): Response
    {
        $method = strtolower($method);

        return Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
        ])->$method($this->setupBaseUrl($url), $params);
    }
}
