<?php

namespace App\Models;

use App\Traits\WithTrashedRouteBinding;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GarageData extends Model
{
    /** @use HasFactory<\Database\Factories\GarageDataFactory> */
    use HasFactory, SoftDeletes, WithTrashedRouteBinding;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
        'coordinate',
        'capacity',
        'phone',
        'opening_time',
        'closing_time',
        'is_active',
        'description',
    ];
}
