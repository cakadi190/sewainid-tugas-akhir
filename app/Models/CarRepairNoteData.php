<?php

namespace App\Models;

use App\Enums\CarRepairNoteStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * 
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $repair_date
 * @property string $description
 * @property int|null $last_mileage
 * @property int|null $current_mileage
 * @property string|null $cost
 * @property string $status
 * @property string|null $notes
 * @property int|null $car_data_id
 * @property-read \App\Models\CarData|null $carData
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 * @method static \Database\Factories\CarRepairNoteDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCurrentMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereLastMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereRepairDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class CarRepairNoteData extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\CarRepairNoteDataFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     * Retrieve a collection of all possible car repair note statuses.
     *
     * @var array<string>
     * @return \Illuminate\Support\Collection|null A collection of CarRepairNoteStatusEnum cases, or null if none.
     */
    protected $fillable = [
        'repair_date',
        'description',
        'last_mileage',
        'current_mileage',
        'cost',
        'status',
        'notes',
        'car_data_id',
    ];

    /**
     * Retrieve a collection of all possible car repair note statuses.
     *
     * @return \Illuminate\Support\Collection|null A collection of CarRepairNoteStatusEnum cases, or null if none.
     */
    public static function getAllRepairStatus(): ?Collection
    {
        return collect(CarRepairNoteStatusEnum::cases())->pluck('value');
    }

    public function carData(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(CarData::class);
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

