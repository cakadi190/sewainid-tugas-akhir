<?php

namespace App\Helpers;

use App\Interfaces\LicensePlateNumberGenerator as LicensePlateNumberGeneratorInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Kelas untuk menghasilkan nomor plat kendaraan Indonesia
 *
 * Kelas ini mengimplementasikan logika untuk menghasilkan nomor plat kendaraan
 * yang valid sesuai dengan format dan aturan yang berlaku di Indonesia.
 * Termasuk semua provinsi termasuk ekspansi wilayah terbaru.
 *
 * Format plat kendaraan: [Kode Wilayah] [Angka] [Huruf]
 * Contoh: B 1234 ABC
 *
 * @package LicensePlate
 * @author Cak Adi
 * @version 2.1.0
 */
class LicensePlateNumberGenerator implements LicensePlateNumberGeneratorInterface {
    /**
     * Daftar kode wilayah untuk setiap provinsi di Indonesia menggunakan Collection
     */
    private Collection $regionCodes;

    public function __construct()
    {
        $this->regionCodes = collect([
            'Aceh' => ['BL'],
            'North Sumatra' => ['BB', 'BK', 'BA'],
            'West Sumatra' => ['BA'],
            'Riau' => ['BM'],
            'Riau Islands' => ['BP'],
            'Jambi' => ['BH'],
            'South Sumatra' => ['BG', 'BN'],
            'Bangka Belitung Islands' => ['BN'],
            'Bengkulu' => ['BD'],
            'Lampung' => ['BE', 'BH'],

            'DKI Jakarta' => ['B'],
            'Banten' => ['A'],
            'West Java' => ['D', 'E', 'F', 'T', 'Z'],
            'Central Java' => ['G', 'H', 'K', 'R', 'AA', 'AD'],
            'DI Yogyakarta' => ['AB'],
            'East Java' => ['L', 'M', 'N', 'P', 'S', 'W', 'AG', 'AE'],

            'Bali' => ['DK'],
            'West Nusa Tenggara' => ['DR', 'EA'],
            'East Nusa Tenggara' => ['DH', 'EB'],

            'West Kalimantan' => ['KB'],
            'Central Kalimantan' => ['KH'],
            'South Kalimantan' => ['DA'],
            'East Kalimantan' => ['KT'],
            'North Kalimantan' => ['KU'],

            'North Sulawesi' => ['DB', 'DL'],
            'Gorontalo' => ['DM'],
            'Central Sulawesi' => ['DN'],
            'West Sulawesi' => ['DC'],
            'South Sulawesi' => ['DD', 'DP', 'DW'],
            'Southeast Sulawesi' => ['DT'],

            'Maluku' => ['DE', 'DG'],
            'North Maluku' => ['DG'],

            'Papua' => ['DS'],
            'West Papua' => ['PB'],
            'South Papua' => ['PA'],
            'Central Papua' => ['PC'],
            'Highland Papua' => ['PG'],
            'Southwest Papua' => ['PD']
        ]);
    }

    /**
     * Menghasilkan angka acak dengan panjang 1-4 digit
     *
     * @return string Angka yang dihasilkan dengan '0' sebagai padding di depan jika perlu
     */
    private function generateNumber(): string {
        return Str::padLeft((string)random_int(1, 9999), random_int(1, 4), '0');
    }

    /**
     * Menghasilkan kombinasi huruf acak untuk bagian belakang plat
     *
     * Menghasilkan 1-3 huruf acak dari A-Z (kecuali I dan O untuk menghindari
     * kebingungan dengan angka 1 dan 0)
     *
     * @return string Kombinasi huruf yang dihasilkan
     */
    private function generateBackLetters(): string {
        return collect(range('A', 'Z'))
            ->reject(fn($char) => in_array($char, ['I', 'O']))
            ->random(random_int(1, 3))
            ->implode('');
    }

    /**
     * {@inheritdoc}
     *
     * @throws \Exception Jika wilayah yang diberikan tidak terdaftar
     */
    public function generateLicensePlate(?string $region = null): string {
        $region = $region ?? $this->regionCodes->keys()->random();

        if (!$this->regionCodes->has($region)) {
            throw new \Exception("Wilayah '$region' tidak valid");
        }

        $regionCode = collect($this->regionCodes->get($region))->random();
        $number = $this->generateNumber();
        $backLetters = $this->generateBackLetters();

        return sprintf("%s %s %s", $regionCode, $number, $backLetters);
    }

    /**
     * Mendapatkan daftar wilayah
     *
     * @return array
     */
    public function getRegionList(): array
    {
        return $this->regionCodes->keys()->toArray();
    }

    /**
     * Mendapatkan kode wilayah berdasarkan nama wilayah
     *
     * @param string $region
     * @return array|null
     */
    public function getRegionCode(string $region): ?array
    {
        return $this->regionCodes->get($region);
    }
}
