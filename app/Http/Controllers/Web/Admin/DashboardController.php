<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * Sets the SEO title for the page and returns
     * the Inertia response for the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        seo()->title('Beranda Admin')->generate();

        return inertia('Admin/Dashboard');
    }
}
