<?php

if (!function_exists("nameToEmail")) {
    /**
     * Mengubah nama lengkap (termasuk gelar) menjadi alamat email.
     *
     * Fungsi ini mengambil nama lengkap (termasuk gelar), menghapus gelar,
     * memformat nama untuk digunakan sebagai alamat email dengan menghapus spasi,
     * mengubah menjadi huruf kecil, dan menambahkan domain email.
     *
     * Jika parameter opsional $needRandomNumber adalah true, maka nomor acak
     * antara 100 dan 999 ditambahkan ke nama email. Jika tidak, maka email
     * dihasilkan tanpa nomor.
     *
     * @param string $fullName Nama lengkap termasuk gelar (contoh, "Gasti Suryatmi S.Pd").
     * @param bool|null $needRandomNumber Jika true, nomor acak ditambahkan ke nama email.
     * @return string Alamat email yang dihasilkan (contoh, "gasti.suryatmi123@gmail.com").
     */
    function nameToEmail(string $fullName, ?bool $needRandomNumber = false): string
    {
        // Pisahkan nama dan gelar
        $parts = explode(' ', $fullName);

        // Hapus gelar (elemen terakhir dari array)
        array_pop($parts);

        // Gabungkan kembali nama tanpa gelar dan ubah menjadi huruf kecil serta ganti spasi dengan titik
        $emailName = str_replace(' ', '.', strtolower(implode(' ', $parts)));

        // Jika $needRandomNumber adalah true, tambahkan nomor acak antara 100 dan 999
        if ($needRandomNumber) {
            $emailName .= rand(100, 999);
        }

        // Tambahkan domain email
        $email = "$emailName@gmail.com";

        return $email;
    }
}
