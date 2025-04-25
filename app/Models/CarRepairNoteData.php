<?php

namespace App\Models;

use App\Enums\CarRepairNoteStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

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
    use HasFactory;

    /**
     * Retrieve a collection of all possible car repair note statuses.
     *
     * @return \Illuminate\Support\Collection|null A collection of CarRepairNoteStatusEnum cases, or null if none.
     */
    public static function getAllRepairStatus(): ?Collection
    {
        return collect(CarRepairNoteStatusEnum::cases())->pluck('value');
    }
}
