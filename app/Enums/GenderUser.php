<?php

namespace App\Enums;

/**
 * Enum GenderUser
 *
 * Enum ini digunakan untuk mendefinisikan jenis kelamin pengguna.
 *
 * Terdapat dua nilai yang mungkin:
 * - MALE: Representasi untuk jenis kelamin pria.
 * - FEMALE: Representasi untuk jenis kelamin wanita.
 *
 * Enum ini juga menyediakan dua metode:
 * - label(): Mengembalikan label bahasa lokal untuk jenis kelamin.
 * - color(): Mengembalikan warna yang sesuai untuk jenis kelamin.
 */
enum GenderUser: string
{
    case MALE = 'male';
    case FEMALE = 'female';

    /**
     * Mendapatkan label untuk jenis kelamin.
     *
     * @return string Label untuk jenis kelamin dalam bahasa lokal.
     */
    function label(): string
    {
        return match($this) {
            self::MALE => 'Pria',
            self::FEMALE => 'Wanita',
        };
    }

    /**
     * Mendapatkan warna yang sesuai untuk jenis kelamin.
     *
     * @return string Warna yang digunakan untuk menandai jenis kelamin.
     */
    function color(): string
    {
        return match($this) {
            self::MALE => 'primary',
            self::FEMALE => 'success',
        };
    }
}
