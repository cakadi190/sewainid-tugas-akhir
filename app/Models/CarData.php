<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Car Data model
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $name
 * @property string $brand
 * @property string $frame_number
 * @property string $license_plate
 * @property string $color
 * @property int $year_of_manufacture
 * @property string $model
 * @property string $status
 * @property string|null $description
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereBrand($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereFrameNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereLicensePlate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereYearOfManufacture($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData withoutTrashed()
 * @mixin \Eloquent
 */
class CarData extends Model
{
    use SoftDeletes, HasFactory;

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
