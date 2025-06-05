<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CarRepairController extends Controller
{
    /**
     * Showing page of car repair data
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        seo()->title('Catatan Perbaikan')->generate();

        return inertia('Admin/CarRepairNoteData/Index');
    }
}
