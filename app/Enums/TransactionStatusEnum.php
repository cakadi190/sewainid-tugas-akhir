<?php

namespace App\Enums;

enum TransactionStatusEnum: string
{
    case UNPAID = 'UNPAID';
    case PAID = 'PAID';
    case EXPIRED = 'EXPIRED';
    case FAILED = 'FAILED';
    case REFUND = 'REFUND';

    public function label(): string
    {
        return match ($this) {
            self::UNPAID => 'Belum Bayar',
            self::PAID => 'Sudah Bayar',
            self::EXPIRED => 'Kadaluarsa',
            self::FAILED => 'Gagal',
            self::REFUND => 'Refund',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::UNPAID => 'bg-yellow-500',
            self::PAID => 'bg-green-500',
            self::EXPIRED => 'bg-red-500',
            self::FAILED => 'bg-red-500',
            self::REFUND => 'bg-blue-500',
        };
    }
}
