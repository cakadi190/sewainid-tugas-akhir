<?php

namespace App\Traits;

/**
 * Trait untuk menangani label dan deskripsi enum
 */
trait EnumOptionTrait
{
    /**
     * Mendapatkan semua opsi enum beserta labelnya
     *
     * @return array<string, string>
     */
    public static function getOptions(): array
    {
        return array_reduce(
            self::cases(),
            fn ($carry, self $enum) => array_merge(
                $carry,
                [$enum->value => $enum->label()]
            ),
            []
        );
    }
}
