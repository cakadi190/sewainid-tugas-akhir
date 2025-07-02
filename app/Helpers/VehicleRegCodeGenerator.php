<?php

namespace App\Helpers;

/**
 * Class VehicleRegCodeGenerator
 *
 * Generator untuk menghasilkan kode registrasi kendaraan yang unik dan sesuai dengan format yang ditentukan.
 *
 * Format kode registrasi kendaraan:
 * - Kode wilayah (2 karakter): B untuk Jakarta, AB untuk Yogyakarta, dan seterusnya.
 * - Tahun (4 digit): Tahun pendaftaran kendaraan.
 * - Kode unik (5 karakter): Kode unik yang dihasilkan secara acak menggunakan karakter A-Z dan 0-9.
 *
 * Contoh:
 * - B-2025-K9D7Z
 * - AB-2024-J8E3K
 */
class VehicleRegCodeGenerator
{
    /**
     * Kode wilayah (2 karakter)
     */
    protected string $regionCode;

    /**
     * Tahun pendaftaran kendaraan (4 digit)
     */
    protected int $year;

    /**
     * Panjang kode unik (5 karakter)
     */
    protected int $uniqueLength;

    /**
     * Konstruktor untuk menginisialisasi objek generator.
     *
     * @param  string  $regionCode  Kode wilayah (2 karakter)
     * @param  int  $uniqueLength  Panjang kode unik (5 karakter)
     */
    public function __construct(string $regionCode = 'B', int $uniqueLength = 5)
    {
        $this->regionCode = strtoupper($regionCode);
        $this->year = (int) date('Y');
        $this->uniqueLength = $uniqueLength;
    }

    /**
     * Menghasilkan kode registrasi kendaraan yang lengkap dan sesuai dengan format yang ditentukan.
     *
     * @return string Kode registrasi kendaraan yang dihasilkan
     */
    public function generate(): string
    {
        $uniqueCode = $this->generateUniqueCode();

        return "{$this->regionCode}-{$this->year}-{$uniqueCode}";
    }

    /**
     * Menghasilkan kode unik yang dihasilkan secara acak menggunakan karakter A-Z dan 0-9.
     *
     * @return string Kode unik yang dihasilkan
     */
    protected function generateUniqueCode(): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $code = '';
        for ($i = 0; $i < $this->uniqueLength; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $code;
    }
}
