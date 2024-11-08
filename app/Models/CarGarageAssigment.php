<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CarGarageAssigment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'car_data_id',
        'from_garage_id',
        'to_garage_id',
        'assignment_date',
    ];

    /**
     * Mendapatkan data mobil yang terkait dengan penugasan ini.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function carData(): HasOne
    {
        return $this->hasOne(CarData::class, 'id', 'car_data_id');
    }

    /**
     * Mendapatkan data garasi asal yang terkait dengan penugasan ini.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function fromGarage(): HasOne
    {
        return $this->hasOne(GarageData::class, 'id', 'from_garage_id');
    }

    /**
     * Mendapatkan data garasi tujuan yang terkait dengan penugasan ini.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function toGarage(): HasOne
    {
        return $this->hasOne(GarageData::class, 'id', 'to_garage_id');
    }
}
