<?php

namespace App\Models;

use App\Enums\UsageNoteTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Note Data after Rental
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $description
 * @property int|null $mileage
 * @property UsageNoteTypeEnum $type
 * @property int|null $user_id
 * @property int|null $car_data_id
 * @property string|null $transaction_id
 *
 * @method static \Database\Factories\UsageNoteDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereUserId($value)
 *
 * @mixin \Eloquent
 */
class UsageNoteData extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'car_data_id',
        'transaction_id',
        'description',
        'mileage',
        'type',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'type' => UsageNoteTypeEnum::class,
    ];

    /**
     * Retrieve a collection of all possible usage note types.
     *
     * @return \Illuminate\Support\Collection A collection of UsageNoteTypeEnum values.
     */
    public static function getAllType(): \Illuminate\Support\Collection
    {
        return collect(value: UsageNoteTypeEnum::cases())->pluck('value');
    }
}
