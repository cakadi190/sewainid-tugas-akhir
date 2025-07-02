<?php

namespace App\Enums;

enum CarConditionEnum: string
{
    case EXCELLENT = 'excellent';
    case GOOD = 'good';
    case FAIR = 'fair';
    case POOR = 'poor';
    case DAMAGED = 'damaged';
    case UNDER_REPAIR = 'under_repair';

    public function label(): string
    {
        return match ($this) {
            self::EXCELLENT => 'Baik',
            self::GOOD => 'Bagus',
            self::FAIR => 'Cukup',
            self::POOR => 'Kurang',
            self::DAMAGED => 'Rusak',
            self::UNDER_REPAIR => 'Direparasi',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::EXCELLENT => 'success',
            self::GOOD => 'success',
            self::FAIR => 'warning',
            self::POOR => 'warning',
            self::DAMAGED => 'danger',
            self::UNDER_REPAIR => 'danger',
        };
    }
}
