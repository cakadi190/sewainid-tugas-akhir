<?php

namespace App\Enums;

enum UsageNoteTypeEnum: string
{
    case NORMAL = 'normal';
    case LATE = 'late';
    case MINOR_DAMAGE = 'minor_damage';
    case MAJOR_DAMAGE = 'major_damage';
    case PICKED_UP = 'picked_up';
    case MISSING = 'missing';

    public function label(): string
    {
        return match ($this) {
            self::NORMAL => 'Normal',
            self::LATE => 'Terlambat',
            self::MINOR_DAMAGE => 'Rusak Ringan',
            self::MAJOR_DAMAGE => 'Rusak Berat',
            self::PICKED_UP => 'Dikembalikan',
            self::MISSING => 'Hilang',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::NORMAL => 'success',
            self::LATE => 'warning',
            self::MINOR_DAMAGE => 'warning',
            self::MAJOR_DAMAGE => 'danger',
            self::PICKED_UP => 'success',
            self::MISSING => 'danger',
        };
    }
}
