<?php

namespace App\Models;

use App\Enums\RentalStatusEnum;
use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Transaction Model
 *
 * @property int $id
 * @property string $status
 * @property string $rental_status
 * @property string|null $confirmed_at
 * @property string|null $payment_channel
 * @property string|null $payment_references
 * @property string|null $expired_at
 * @property int $total_price
 * @property int $total_pay
 * @property string|null $pickup_date
 * @property string|null $return_date
 * @property string $place_name
 * @property string $longitude
 * @property string $latitude
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $car_data_id
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
 * @mixin \Eloquent
 */
class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

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
     * Retrieve a collection of all possible transaction statuses.
     *
     * @return \Illuminate\Support\Collection|null A collection of RentalStatusEnum cases, or null if none.
     */
    public static function getAllRentalStatus(): ?Collection
    {
        return collect(RentalStatusEnum::cases())->pluck('value');
    }
}
