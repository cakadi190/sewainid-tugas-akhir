<?php

namespace App\Enums;

/**
 * Enum CarModelEnum
 *
 * Enum ini mendefinisikan tipe-tipe model mobil yang umum disewa di Indonesia,
 * serta menyediakan label yang mudah dibaca dan warna untuk setiap tipe menggunakan kelas bootstrap.
 */
enum CarModelEnum: string
{
    case MINI_VAN = 'minivan';
    case VAN = 'van';
    case CITY_CAR = 'city_car';
    case HATCHBACK = 'hatchback';
    case SEDAN = 'sedan';
    case SUV = 'suv';
    case MPV = 'mpv';
    case PICKUP = 'pickup';
    case LUXURY_CAR = 'luxury_car';

    /**
     * Mendapatkan label yang dapat dibaca manusia untuk setiap tipe mobil.
     *
     * @return string Label yang lebih mudah dibaca dari tipe mobil.
     */
    public function label(): string
    {
        return match ($this) {
            self::MINI_VAN => 'Mini Van',
            self::VAN => 'Van',
            self::CITY_CAR => 'City Car',
            self::HATCHBACK => 'Hatchback',
            self::SEDAN => 'Sedan',
            self::SUV => 'SUV',
            self::MPV => 'MPV',
            self::PICKUP => 'Pickup Truck',
            self::LUXURY_CAR => 'Luxury Car',
        };
    }

    /**
     * Mendapatkan kelas warna Bootstrap untuk setiap tipe mobil.
     * Warna ini bisa digunakan untuk menandai kategori mobil dalam UI.
     *
     * @return string Nama kelas Bootstrap untuk warna.
     */
    public function color(): string
    {
        return match ($this) {
            self::MINI_VAN, self::VAN, self::PICKUP => 'primary',
            self::CITY_CAR, self::HATCHBACK => 'success',
            self::SEDAN => 'info',
            self::SUV, self::MPV => 'warning',
            self::LUXURY_CAR => 'danger',
        };
    }
}
