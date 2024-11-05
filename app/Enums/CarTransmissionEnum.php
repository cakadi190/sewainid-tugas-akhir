<?php

namespace App\Enums;

enum CarTransmissionEnum: string
{
    case MT = 'manual';
    case AT = 'automatic';

    public function label()
    {
        return match($this) {
            self::MT => 'Transmisi Manual',
            self::AT => 'Transmisi Otomatis',
        };
    }

    public function color()
    {
        return match($this) {
            self::MT => 'primary',
            self::AT => 'secondary',
        };
    }
}
