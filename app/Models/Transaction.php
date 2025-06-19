<?php

namespace App\Models;

use App\Enums\RentalStatusEnum;
use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Transaction Model
 *
 * @property string $id
 * @property string $status
 * @property string $rental_status
 * @property \Illuminate\Support\Carbon|null $confirmed_at
 * @property string|null $payment_channel
 * @property string|null $payment_references
 * @property \Illuminate\Support\Carbon|null $expired_at
 * @property int $total_price
 * @property int $total_pay
 * @property \Illuminate\Support\Carbon|null $pickup_date
 * @property \Illuminate\Support\Carbon|null $return_date
 * @property string $place_name
 * @property bool $with_driver
 * @property string $longitude
 * @property string $latitude
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $car_data_id
 * @property-read \App\Models\CarData|null $carData
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\TransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereConfirmedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereExpiredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePaymentChannel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePaymentReferences($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePickupDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePlaceName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereRentalStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereReturnDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereTotalPay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereTotalPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereWithDriver($value)
 * @mixin \Eloquent
 */
class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    /**
     * The key type of the model.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'status',
        'rental_status',
        'confirmed_at',
        'payment_channel',
        'payment_references',
        'expired_at',
        'total_price',
        'total_pay',
        'pickup_date',
        'return_date',
        'place_name',
        'with_driver',
        'longitude',
        'latitude',
        'user_id',
        'car_data_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'confirmed_at' => 'datetime',
        'expired_at' => 'datetime',
        'pickup_date' => 'datetime',
        'return_date' => 'datetime',
        'with_driver' => 'boolean',
    ];

    /**
     * Retrieve a collection of all possible transaction statuses.
     *
     * @return \Illuminate\Support\Collection|null A collection of TransactionStatusEnum cases, or null if none.
     */
    public static function getAllStatus(): ?Collection
    {
        return collect(TransactionStatusEnum::cases())->pluck('value');
    }

    /**
     * Retrieve a collection of all possible rental statuses.
     *
     * @return \Illuminate\Support\Collection|null A collection of RentalStatusEnum cases, or null if none.
     */
    public static function getAllRentalStatus(): ?Collection
    {
        return collect(RentalStatusEnum::cases())->pluck('value');
    }

    /**
     * The car data that this transaction belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function carData(): BelongsTo
    {
        return $this->belongsTo(CarData::class);
    }

    /**
     * The user that this transaction belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The transaction confirmation that belongs to this transaction.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function transactionConfirmation(): HasOne
    {
        return $this->hasOne(TransactionConfirmation::class);
    }
}
