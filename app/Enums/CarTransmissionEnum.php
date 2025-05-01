<?php

namespace App\Enums;

enum CarTransmissionEnum: string
{
    case MT = 'manual';
    case AT = 'automatic';
    case SMT = 'semi_manual';

    public function label()
    {
        return match($this) {
            self::MT => 'Transmisi Manual',
            self::AT => 'Transmisi Otomatis',
            self::SMT => 'Transmisi Semi-Manual',
        };
    }

    public function color()
    {
        return match($this) {
            self::MT => 'primary',
            self::AT => 'secondary',
            self::SMT => 'success',
        };
    }
}
