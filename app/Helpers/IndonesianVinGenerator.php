<?php

namespace App\Helpers;

/**
 * VinGeneratorHelper adalah helper class untuk menghasilkan Vehicle Identification Number (VIN)
 * yang valid sesuai dengan standar internasional dan disesuaikan untuk produsen kendaraan di Indonesia.
 * VIN terdiri dari 17 karakter, dengan bagian WMI, VDS, dan VIS yang dihasilkan secara acak.
 *
 * Struktur VIN:
 * - WMI (World Manufacturer Identifier) - 3 karakter pertama, mewakili kode produsen kendaraan.
 * - VDS (Vehicle Descriptor Section) - 6 karakter berikutnya, mewakili fitur kendaraan.
 * - VIS (Vehicle Identifier Section) - 8 karakter terakhir, mewakili tahun produksi dan nomor seri unik.
 */
class IndonesianVinGenerator
{
    /**
     * Menghasilkan VIN acak yang valid untuk kendaraan di Indonesia.
     *
     * VIN yang dihasilkan akan memiliki 17 karakter alfanumerik yang terdiri dari:
     * - 3 karakter WMI yang dipilih secara acak dari daftar WMI Indonesia.
     * - 6 karakter VDS yang mewakili fitur kendaraan.
     * - 8 karakter VIS yang berisi kode tahun produksi dan nomor seri unik.
     *
     * @return string VIN yang dihasilkan dalam format 17 karakter.
     */
    public static function generateVin()
    {
        $wmi = self::generateWMI();
        $vds = self::generateVDS();
        $vis = self::generateVIS();

        return "{$wmi}{$vds}{$vis}";
    }

    /**
     * Menghasilkan World Manufacturer Identifier (WMI) untuk kendaraan di Indonesia.
     *
     * WMI adalah kode 3 karakter yang mengidentifikasi produsen dan negara asal kendaraan.
     * Metode ini memilih satu kode WMI secara acak dari daftar yang tersedia di Indonesia.
     *
     * @return string 3 karakter WMI yang mewakili produsen kendaraan.
     */
    private static function generateWMI()
    {
        // Kumpulan kode WMI untuk Indonesia
        $wmiCodes = [
            'MH1', // Honda
            'MH8', // Suzuki
            'MHY', // Yamaha
            'MHK', // Kawasaki
            'MHN', // Nissan
            'MHR', // Toyota
            'MHF', // Ford
            'MHJ', // Daihatsu
            'MHT', // Mitsubishi
            'MH3', // Mercedes-Benz
            'MH4', // BMW
            'MH5', // Isuzu
            'MH9', // Hyundai
            'MH6', // KIA
            'MH2', // DFSK
            'MHZ', // Wuling
        ];

        return $wmiCodes[array_rand($wmiCodes)];
    }

    /**
     * Menghasilkan Vehicle Descriptor Section (VDS) untuk VIN.
     *
     * VDS adalah bagian VIN yang terdiri dari 6 karakter (posisi 4-9) dan digunakan untuk
     * mengidentifikasi fitur atau tipe kendaraan, seperti model dan gaya bodi.
     *
     * @return string 6 karakter acak yang mewakili fitur kendaraan.
     */
    private static function generateVDS()
    {
        // Menghasilkan 6 karakter alfanumerik acak untuk VDS
        return strtoupper(substr(str_shuffle('ABCDEFGHJKLMNPRSTUVWXYZ0123456789'), 0, 6));
    }

    /**
     * Menghasilkan Vehicle Identifier Section (VIS) untuk VIN.
     *
     * VIS terdiri dari 8 karakter terakhir dari VIN (posisi 10-17) dan digunakan untuk
     * mengidentifikasi tahun produksi serta nomor seri kendaraan yang unik.
     * Karakter pertama dalam VIS (digit ke-10 dalam VIN) biasanya menunjukkan kode tahun produksi.
     *
     * @return string 8 karakter yang terdiri dari kode tahun produksi dan nomor seri unik.
     */
    private static function generateVIS()
    {
        // Digit ke-10 (kode tahun produksi) diset ke 'L' sebagai contoh, bisa diubah sesuai kebutuhan
        $yearCode = 'L'; // Misalnya, 'L' untuk 2020, 'M' untuk 2021, dll.
        // Menghasilkan 7 karakter alfanumerik acak untuk melengkapi VIS
        $serial = strtoupper(substr(str_shuffle('0123456789ABCDEFGHJKLMNPRSTUVWXYZ'), 0, 7));

        return $yearCode . $serial;
    }
}
