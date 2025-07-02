<?php

namespace App\Models;

use App\Enums\CarConditionEnum;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;
use App\Enums\CarTransmissionEnum;
use App\Enums\FuelTypeEnum;
use App\Enums\TransactionStatusEnum;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * Car Data model
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $car_name
 * @property string $brand Misal: Toyota, Suzuki, Honda, Mercy
 * @property string|null $slug
 * @property string $frame_number
 * @property string $engine_number
 * @property string $license_plate
 * @property string $license_plate_expiration
 * @property string|null $vehicle_registration_cert_number
 * @property string|null $vehicle_ownership_book_number
 * @property string $vehicle_registration_cert_expiration
 * @property string $color
 * @property int $year_of_manufacture
 * @property CarTransmissionEnum $transmission
 * @property CarModelEnum $model
 * @property CarStatusEnum $status
 * @property FuelTypeEnum $fuel_type
 * @property CarConditionEnum $condition
 * @property string|null $description
 * @property int $doors
 * @property int $seats
 * @property int $max_speed
 * @property int $big_luggage
 * @property int $med_luggage
 * @property int $small_luggage
 * @property int $mileage
 * @property int $ac
 * @property int $audio
 * @property int $abs
 * @property int $child_lock
 * @property int $traction_control
 * @property int $baby_seat
 * @property int $rent_price
 * @property string|null $gps_imei
 * @property-read mixed $full_name
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $review
 * @property-read int|null $review_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transaction
 * @property-read int|null $transaction_count
 *
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCondition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDoors($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereEngineNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereFrameNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereFuelType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereGpsImei($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereLicensePlate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereLicensePlateExpiration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMedLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereRentPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSeats($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSmallLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereTractionControl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereTransmission($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleOwnershipBookNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleRegistrationCertExpiration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleRegistrationCertNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereYearOfManufacture($value)
 *
 * @mixin \Eloquent
 */
class CarData extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia;

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
        'condition',
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
        'gps_imei',
        'fuel_type',
        'rent_price',
        'vehicle_ownership_book_number',
        'mileage',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'model' => CarModelEnum::class,
        'status' => CarStatusEnum::class,
        'condition' => CarConditionEnum::class,
        'transmission' => CarTransmissionEnum::class,
        'fuel_type' => FuelTypeEnum::class,
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
     * Mengambil semua jenis bahan bakar mobil yang ada dalam FuelTypeEnum.
     *
     * @return \Illuminate\Support\Collection Koleksi dari semua nilai jenis bahan bakar mobil.
     */
    public static function getAllCarFuelEnum(): \Illuminate\Support\Collection
    {
        return collect(FuelTypeEnum::cases())->pluck('value');
    }

    /**
     * Retrieve a collection of all possible car conditions.
     *
     * @return \Illuminate\Support\Collection A collection of CarConditionEnum values.
     */
    public static function getAllCarCondition(): \Illuminate\Support\Collection
    {
        return collect(CarConditionEnum::cases())->pluck('value');
    }

    /**
     * Get the full name of the car by combining the brand and car name.
     *
     * @return string The full name of the car.
     */
    public function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->brand} {$this->car_name}",
        );
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['brand', 'car_name'])
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(128);
    }

    /**
     * Relasi dengan model Review.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Review>
     */
    public function review(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Relasi dengan model Transaction.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Transaction>
     */
    public function transaction(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get all disabled (unavailable) dates for the car based on its transactions.
     *
     * @return array<string> Tanggal-tanggal yang tidak tersedia dalam format 'Y-m-d'
     */
    public function getUnavailableDate(): array
    {
        return $this->transaction()
            ->whereIn('status', [TransactionStatusEnum::PAID, TransactionStatusEnum::UNPAID])
            ->get()
            ->flatMap(function ($transaction) {
                return CarbonPeriod::create($transaction->pickup_date, $transaction->return_date)
                    ->toArray();
            })
            ->map(fn ($date) => $date->setTimezone('Asia/Jakarta')->format('Y-m-d'))
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Determine if the given date is not in the car's unavailable dates.
     */
    public function isNotOnUnavailableDate(string|Carbon|null $date): bool
    {
        return ! is_null($date)
            && ! collect($this->getUnavailableDate())
                ->contains($date instanceof Carbon ? $date->toDateString() : (string) $date);
    }

    /**
     * Register media conversions for the CarData model.
     *
     * This function adds a 'preview' media conversion that fits the media within
     * a 300x300 boundary using the 'Contain' fit method. The conversion is processed
     * without being queued.
     *
     * @param  \Spatie\MediaLibrary\MediaCollections\Models\Media|null  $media
     *                                                                          Optional media instance for which conversions are registered.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();
    }
}
