<?php

namespace App\Models;

use App\Enums\CarRepairNoteStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 *
 *
 * @method static \Database\Factories\CarRepairNoteDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData query()
 * @mixin \Eloquent
 */
class CarRepairNoteData extends Model
{
    /** @use HasFactory<\Database\Factories\CarRepairNoteDataFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * Retrieve a collection of all possible car repair note statuses.
     *
     * @return \Illuminate\Support\Collection|null A collection of CarRepairNoteStatusEnum cases, or null if none.
     */
    public static function getAllRepairStatus(): ?Collection
    {
        return collect(CarRepairNoteStatusEnum::cases())->pluck('value');
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
