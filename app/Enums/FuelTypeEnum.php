<?php

namespace App\Enums;

enum FuelTypeEnum: string
{
    case GASOLINE = 'gasoline';
    case DIESEL = 'diesel';
    case ELECTRIC = 'electric';
    case LPG = 'lpg';
    case CNG = 'cng';
    case BIOFUEL = 'biofuel';
    case HYDROGEN = 'hydrogen';
    case HYBRID = 'hybrid';
    case PLUGIN_HYBRID = 'plugin_hybrid';
    case OTHER = 'other';

    public function label(): string
    {
        return match($this) {
            self::GASOLINE => 'Bensin',
            self::DIESEL => 'Solar / Diesel',
            self::ELECTRIC => 'Listrik',
            self::LPG => 'LPG',
            self::CNG => 'CNG',
            self::BIOFUEL => 'Biofuel',
            self::HYDROGEN => 'Hidrogen',
            self::HYBRID => 'Hybrid',
            self::PLUGIN_HYBRID => 'Plug-in Hybrid',
            self::OTHER => 'Lainnya',
        };
    }
}
