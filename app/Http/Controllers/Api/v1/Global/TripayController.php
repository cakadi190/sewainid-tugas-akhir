<?php

namespace App\Http\Controllers\Api\v1\Global;

use App\Helpers\TripayHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TripayController extends Controller
{
    public function __construct(
        protected readonly TripayHelper $_tripay
    ) {
    }

    public function getChannels(Request $request)
    {
        try {
            return $this->_tripay->getChannels($request->filled('search') ? $request->search : null);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() === 0 ? Response::HTTP_INTERNAL_SERVER_ERROR : $e->getCode();

            return response()->json([
                'title' => 'Sorry! Something Was Wrong Here!',
                'message' => $e->getMessage(),
                'code' => $statusCode
            ], $statusCode);
        }
    }
}
