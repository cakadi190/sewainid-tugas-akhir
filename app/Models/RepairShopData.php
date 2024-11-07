<?php

namespace App\Models;

use App\Traits\WithTrashedRouteBinding;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RepairShopData extends Model
{
    /** @use HasFactory<\Database\Factories\GarageDataFactory> */
    use HasFactory, SoftDeletes, WithTrashedRouteBinding;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'repair_shop_name',
        'address',
        'coordinate',
        'phone',
        'opening_time',
        'closing_time',
        'is_active',
        'description',
    ];
}
