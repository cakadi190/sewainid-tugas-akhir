<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CarFeatureData extends Model
{
    /** @use HasFactory<\Database\Factories\CarFeatureDataFactory> */
    use HasFactory;

    /**
     * Get the cars associated with the feature.
     *
     * This defines a many-to-many relationship between CarFeatureData and CarData,
     * using the 'car_data_feature' pivot table.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(CarData::class, 'car_data_feature', 'car_feature_data_id', 'car_data_id')
                    ->withTimestamps();
    }
}
