<?php

namespace App\Models;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Assign Driver Model
 *
 * @property int $id
 * @property int $transaction_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Transaction $transaction
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\AssignDriverFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereUserId($value)
 * @mixin \Eloquent
 */
class AssignDriver extends Model
{
    /** @use HasFactory<\Database\Factories\AssignDriverFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaction_id',
        'user_id',
    ];

    /**
     * Get the transaction that owns the AssignDriver
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get the user that is assigned as the driver.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

