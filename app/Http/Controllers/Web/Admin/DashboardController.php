<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        seo()->title('Beranda Admin')->generate();

        return inertia('Admin/Dashboard');
    }
}
