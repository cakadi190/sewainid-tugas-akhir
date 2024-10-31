<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;

class CarData extends Model
{
    /**
     * Mengambil semua model mobil yang ada dalam CarModelEnum.
     *
     * @return \Illuminate\Support\Collection Koleksi dari semua nilai model mobil.
     */
    public static function getAllCarModels(): \Illuminate\Support\Collection
    {
        return collect(CarModelEnum::cases())->pluck('value');
    }

    /**
     * Mengambil semua status mobil yang ada dalam CarStatusEnum.
     *
     * @return \Illuminate\Support\Collection Koleksi dari semua nilai status mobil.
     */
    public static function getAllCarStatuses(): \Illuminate\Support\Collection
    {
        return collect(CarStatusEnum::cases())->pluck('value');
    }
}
