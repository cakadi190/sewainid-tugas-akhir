<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait SearchEncryptedData
{
    /**
     * Search for the first data within encrypted columns.
     *
     * This method fetches rows, decrypts the values, and returns the first row
     * that matches the provided plain text value.
     *
     * @param Builder $query The Eloquent query builder instance.
     * @param string $column The name of the column containing encrypted data.
     * @param string $value The plain text value to search for after decryption.
     *
     * @return Model|null The first model where the decrypted column value matches the provided value, or null if no match is found.
     */
    public function scopeSearchEncrypted(Builder $query, string $column, string $value): ?Model
    {
        return $query->whereNotNull($column)
            ->get()
            ->first(function ($item) use ($column, $value) {
                try {
                    return $item->$column === $value;
                } catch (\Exception $e) {
                    return false;
                }
            });
    }
}
