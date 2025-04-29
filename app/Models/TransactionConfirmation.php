<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $transaction_receipt
 * @property string $transaction_id
 * @property int|null $user_id
 * @method static \Database\Factories\TransactionConfirmationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereTransactionReceipt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereUserId($value)
 * @mixin \Eloquent
 */
class TransactionConfirmation extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionConfirmationFactory> */
    use HasFactory;
}
