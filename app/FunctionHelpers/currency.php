<?php

if (!function_exists('currency')) {
    /**
     * Format angka menjadi format mata uang Rupiah.
     *
     * Fungsi ini menerima sebuah angka dan mengubahnya ke dalam format mata uang Rupiah
     * dengan dua desimal, pemisah ribuan berupa titik, dan pemisah desimal berupa koma.
     *
     * @param float|int|string $amount Angka yang akan diformat menjadi Rupiah.
     *
     * @throws InvalidArgumentException Jika parameter bukan angka.
     *
     * @return string Format mata uang Rupiah dalam bentuk string.
     */
    function currency($amount)
    {
        if (!is_numeric($amount)) {
            throw new InvalidArgumentException('Parameter harus berupa angka');
        }
        return 'Rp' . number_format($amount, 2, ',', '.');
    }
}

if (!function_exists('penyebut')) {
    /**
     * Mengubah angka menjadi kata dalam bahasa Indonesia.
     *
     * @param int $nilai Angka yang akan diubah menjadi kata.
     * @return string Kata-kata dalam bahasa Indonesia yang mewakili angka.
     * @see https://www.malasngoding.com/cara-mudah-membuat-fungsi-terbilang-dengan-php/
     */
    function penyebut($nilai)
    {
        $nilai = abs($nilai);
        $huruf = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

        return match (true) {
            $nilai < 12 => " " . $huruf[$nilai],
            $nilai < 20 => penyebut($nilai - 10) . " belas",
            $nilai < 100 => penyebut(floor($nilai / 10)) . " puluh" . penyebut($nilai % 10),
            $nilai < 200 => " seratus" . penyebut($nilai - 100),
            $nilai < 1000 => penyebut(floor($nilai / 100)) . " ratus" . penyebut($nilai % 100),
            $nilai < 2000 => " seribu" . penyebut($nilai - 1000),
            $nilai < 1000000 => penyebut(floor($nilai / 1000)) . " ribu" . penyebut($nilai % 1000),
            $nilai < 1000000000 => penyebut(floor($nilai / 1000000)) . " juta" . penyebut($nilai % 1000000),
            $nilai < 1000000000000 => penyebut(floor($nilai / 1000000000)) . " milyar" . penyebut($nilai % 1000000000),
            $nilai < 1000000000000000 => penyebut(floor($nilai / 1000000000000)) . " trilyun" . penyebut($nilai % 1000000000000),
            default => ""
        };
    }
}

if (!function_exists('terbilang')) {
    /**
     * Mengubah angka menjadi kata dalam bahasa Indonesia dengan penanganan negatif.
     *
     * @param int $nilai Angka yang akan diubah menjadi kata.
     * @return string Kata-kata dalam bahasa Indonesia yang mewakili angka, dengan penanganan negatif jika diperlukan.
     * @see https://www.malasngoding.com/cara-mudah-membuat-fungsi-terbilang-dengan-php/
     */
    function terbilang($nilai)
    {
        $hasil = $nilai < 0 ? "minus " . trim(penyebut($nilai)) : trim(penyebut($nilai));
        return "$hasil rupiah";
    }
}

