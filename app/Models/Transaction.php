<?php

namespace App\Models;

use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    /**
     * Retrieve a collection of all possible transaction statuses.
     *
     * @return \Illuminate\Support\Collection|null A collection of TransactionStatusEnum cases, or null if none.
     */
    public static function getAllStatus(): ?Collection
    {
        return collect(TransactionStatusEnum::cases())->pluck('value');
    }
}
