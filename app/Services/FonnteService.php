<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * FonnteHelper - Service untuk mengirim WhatsApp via Fonnte API dengan gaya builder.
 *
 * Contoh penggunaan:
 * FonnteHelper::message('Pesan kamu', '0812xxxx|Nama|Role')
 *     ->attachment('/path/to/file.jpg')
 *     ->location('-7.9,112.6')
 *     ->typing(true)
 *     ->send();
 */
class FonnteService
{
    protected string $token;
    protected array $data = [];
    protected ?string $file = null;

    public function __construct()
    {
        $this->token = config('services.fonnte.token');
    }

    /**
     * Inisialisasi pesan dan target penerima.
     *
     * @param  string  $message  Format pesan, bisa pakai {name} dan {var1}.
     * @param  string  $target  Format target: nomor|nama|var1 (gunakan koma untuk multiple).
     */
    public static function message(string $message, string $target): static
    {
        $instance = new static;
        $instance->data['message'] = $message;
        $instance->data['target'] = $target;
        $instance->data['delay'] = 2;
        $instance->data['typing'] = 'false';
        $instance->data['schedule'] = 0;
        $instance->data['countryCode'] = '62';

        return $instance;
    }

    /**
     * Tambahkan file attachment ke pesan.
     *
     * @param  string  $filePath  Path lengkap ke file.
     * @param  string|null  $filename  Nama file (opsional).
     */
    public function attachment(string $filePath, ?string $filename = null): static
    {
        if (file_exists($filePath)) {
            $this->file = $filePath;
            $this->data['filename'] = $filename ?? basename($filePath);
        }

        return $this;
    }

    /**
     * Tambahkan gambar URL ke pesan.
     *
     * @param  string  $url  Link gambar.
     */
    public function url(string $url): static
    {
        $this->data['url'] = $url;

        return $this;
    }

    /**
     * Set lokasi pengiriman dalam format koordinat (latitude,longitude).
     */
    public function location(string $coordinates): static
    {
        $this->data['location'] = $coordinates;

        return $this;
    }

    /**
     * Atur waktu penjadwalan pengiriman dalam bentuk UNIX timestamp.
     */
    public function schedule(int $timestamp): static
    {
        $this->data['schedule'] = $timestamp;

        return $this;
    }

    /**
     * Aktifkan atau nonaktifkan animasi mengetik sebelum kirim pesan.
     */
    public function typing(bool $enabled = true): static
    {
        $this->data['typing'] = $enabled ? 'true' : 'false';

        return $this;
    }

    /**
     * Kirim pesan follow-up berdasarkan ID pesan sebelumnya.
     */
    public function followup(int $messageId): static
    {
        $this->data['followup'] = $messageId;

        return $this;
    }

    /**
     * Set kode negara (default 62).
     */
    public function countryCode(string $code): static
    {
        $this->data['countryCode'] = $code;

        return $this;
    }

    /**
     * Set delay antara pesan, dalam detik.
     */
    public function delay(int $seconds): static
    {
        $this->data['delay'] = $seconds;

        return $this;
    }

    /**
     * Eksekusi permintaan dan kirim pesan ke Fonnte API.
     */
    public function send(): array|string
    {
        $multipart = [];

        foreach ($this->data as $key => $value) {
            $multipart[] = [
                'name' => $key,
                'contents' => $value,
            ];
        }

        if ($this->file) {
            $multipart[] = [
                'name' => 'file',
                'contents' => fopen($this->file, 'r'),
                'filename' => $this->data['filename'] ?? basename($this->file),
            ];
        }

        try {
            $response = Http::withHeaders(['Authorization' => $this->token])
                ->asMultipart()
                ->post('https://api.fonnte.com/send', $multipart);

            return $response->json();
        } catch (RequestException $e) {
            Log::info('Request status', $e->getTrace());

            return $e->getMessage();
        }
    }
}
