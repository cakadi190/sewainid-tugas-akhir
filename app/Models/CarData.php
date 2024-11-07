<?php

namespace App\Models;

use App\Traits\WithTrashedRouteBinding;
use Illuminate\Database\Eloquent\Model;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;
use App\Enums\CarTransmissionEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
class CarData extends Model implements HasMedia
{
    use SoftDeletes, HasFactory, InteractsWithMedia, WithTrashedRouteBinding;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'car_name',
        'brand',
        'frame_number',
        'license_plate',
        'color',
        'year_of_manufacture',
        'model',
        'status',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'model' => CarModelEnum::class,
        'status' => CarStatusEnum::class,
    ];

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

    /**
     * Mengambil semua jenis transmisi mobil yang ada dalam value: CarTransmissionEnum.
     *
     * @return \Illuminate\Support\Collection Koleksi dari semua jenis transmisi mobil.
     */
    public static function getAllCarTransmission(): \Illuminate\Support\Collection
    {
        return collect(value: CarTransmissionEnum::cases())->pluck('value');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();
    }

    /**
     * Get the features associated with the car.
     *
     * This defines a many-to-many relationship between CarData and CarFeatureData,
     * using the 'car_data_feature' pivot table.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function features(): HasMany
    {
        return $this->hasMany(CarFeatureData::class)
                    ->withTimestamps();
    }
}
