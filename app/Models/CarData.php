<?php

namespace App\Models;

use App\Traits\WithTrashedRouteBinding;
use Illuminate\Database\Eloquent\Model;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;
use App\Enums\CarTransmissionEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
 * @property string $car_name
 * @property string $brand Misal: Toyota, Suzuki, Honda, Mercy
 * @property string $frame_number
 * @property string $engine_number
 * @property string $license_plate
 * @property string $license_plate_expiration
 * @property string $vehicle_registration_cert_number
 * @property string $vehicle_registration_cert_expiration
 * @property string $color
 * @property int $year_of_manufacture
 * @property string $transmission
 * @property CarModelEnum $model
 * @property CarStatusEnum $status
 * @property string|null $description
 * @property int $doors
 * @property int $seats
 * @property int $max_speed
 * @property int $big_luggage
 * @property int $med_luggage
 * @property int $small_luggage
 * @property int $ac
 * @property int $audio
 * @property int $abs
 * @property int $child_lock
 * @property int $traction_control
 * @property int $baby_seat
 * @property string|null $deleted_at
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 * @method static \Database\Factories\CarDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereAbs($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereAc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereAudio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereBabySeat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereBigLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereBrand($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCarName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereChildLock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDoors($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereEngineNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereFrameNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereLicensePlate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereLicensePlateExpiration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMedLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSeats($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSmallLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereTractionControl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereTransmission($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleRegistrationCertExpiration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleRegistrationCertNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereYearOfManufacture($value)
 * @mixin \Eloquent
 */
class CarData extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'car_name',
        'brand',
        'frame_number',
        'engine_number',
        'license_plate',
        'license_plate_expiration',
        'vehicle_registration_cert_number',
        'vehicle_registration_cert_expiration',
        'color',
        'year_of_manufacture',
        'transmission',
        'model',
        'status',
        'description',
        'doors',
        'seats',
        'max_speed',
        'big_luggage',
        'med_luggage',
        'small_luggage',
        'ac',
        'audio',
        'abs',
        'child_lock',
        'traction_control',
        'baby_seat',
        'gps_imei'
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

    /**
     * Register media conversions for the CarData model.
     *
     * This function adds a 'preview' media conversion that fits the media within
     * a 300x300 boundary using the 'Contain' fit method. The conversion is processed
     * without being queued.
     *
     * @param \Spatie\MediaLibrary\MediaCollections\Models\Media|null $media
     *        Optional media instance for which conversions are registered.
     *
     * @return void
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();
    }
}
