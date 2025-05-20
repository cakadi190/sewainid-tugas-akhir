<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard page.
     *
     * Sets the SEO title for the page and returns
     * the Inertia response for the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        seo()->title('Beranda Admin')->generate();

        return inertia('Admin/Dashboard');
    }
}
