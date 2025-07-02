<?php

namespace App\Http\Controllers\Api\v1\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class BookingController extends Controller
{
    public function __invoke(Request $request)
    {
        return DataTables::of(auth()->user()->transactions()->latest())
            ->make();
    }
}
