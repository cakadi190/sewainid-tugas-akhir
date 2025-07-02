<?php

namespace App\Enums;

/**
 * Enum RoleUser
 *
 * Enum ini digunakan untuk mendefinisikan peran pengguna dalam sistem.
 *
 * Terdapat empat nilai yang mungkin:
 * - ADMIN: Representasi untuk pengguna dengan peran administrator.
 * - MONETARY: Representasi untuk pengguna dengan peran keuangan.
 * - DRIVER: Representasi untuk pengguna dengan peran sebagai pengemudi.
 * - USER: Representasi untuk pengguna biasa.
 *
 * Enum ini juga menyediakan dua metode:
 * - label(): Mengembalikan label yang sesuai untuk peran pengguna.
 * - color(): Mengembalikan warna yang sesuai untuk peran pengguna.
 */
enum RoleUser: string
{
    case ADMIN = 'admin';
    case MONETARY = 'monetary';
    case DRIVER = 'driver';
    case CONDUCTOR = 'conductor';
    case USER = 'user';

    /**
     * Mendapatkan label untuk peran pengguna.
     *
     * @return string Label untuk peran dalam bahasa lokal.
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::MONETARY => 'Keuangan',
            self::DRIVER => 'Pengemudi',
            self::CONDUCTOR => 'Kondektur',
            self::USER => 'Pengguna',
        };
    }

    /**
     * Mendapatkan warna yang sesuai untuk peran pengguna.
     *
     * @return string Warna yang digunakan untuk menandai peran pengguna.
     */
    public function color(): string
    {
        return match ($this) {
            self::ADMIN => 'danger',
            self::MONETARY => 'info',
            self::DRIVER => 'warning',
            self::CONDUCTOR => 'dark',
            self::USER => 'success',
        };
    }
}
