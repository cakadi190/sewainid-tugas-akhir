<?php

if (!function_exists("nameToEmail")) {
    /**
     * Converts a full name (including title) to an email address.
     *
     * This function takes a full name (including any title), removes the title,
     * formats the name for use as an email address by removing spaces, converting
     * to lowercase, and appending an email domain.
     *
     * If the optional parameter $needRandomNumber is true, it appends a random
     * number between 100 and 999 to the email name. Otherwise, it generates the email
     * without a number.
     *
     * @param string $fullName Full name including title (e.g., "Gasti Suryatmi S.Pd").
     * @param bool|null $needRandomNumber If true, a random number is appended to the email name.
     * @return string The generated email address (e.g., "gasti.suryatmi123@gmail.com").
     */
    function nameToEmail(string $fullName, ?bool $needRandomNumber = false): string
    {
        // Pisahkan nama dan gelar
        $parts = explode(' ', $fullName);

        // Hapus gelar (elemen terakhir dari array)
        array_pop($parts);

        // Gabungkan kembali nama tanpa gelar
        $nameWithoutTitle = implode(' ', $parts);

        // Ubah menjadi huruf kecil dan ganti spasi dengan titik
        $emailName = str_replace(' ', '.', strtolower($nameWithoutTitle));

        // Jika $needRandomNumber adalah true, tambahkan nomor acak antara 100 dan 999
        if ($needRandomNumber) {
            $randomNumber = rand(100, 999);
            $emailName .= $randomNumber;
        }

        // Tambahkan domain email
        $email = "$emailName@gmail.com";

        return $email;
    }
}
