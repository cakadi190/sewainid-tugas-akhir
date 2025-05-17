<?php

namespace App\Http\Controllers\Api\v1\Global;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Class GmapPlaceController
 *
 * Controller ini bertugas untuk mencari lokasi menggunakan Google Places API
 * berdasarkan nama tempat yang diberikan user (misalnya: "Gembira Loka Zoo").
 *
 * @package App\Http\Controllers
 */
class GmapPlaceController extends Controller
{
    /**
     * Mencari tempat berdasarkan query teks menggunakan Google Places Text Search API.
     *
     * Endpoint: GET /places/search?query={nama_tempat}
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     *
     * @example
     * GET /places/search?query=Gembira+Loka+Zoo
     * Response:
     * {
     *   "results": [
     *     {
     *       "name": "Gembira Loka Zoo",
     *       "address": "Jl. Kebun Raya No.2, Yogyakarta, Indonesia",
     *       "latitude": -7.802086,
     *       "longitude": 110.398597,
     *       "place_id": "ChIJh3XfOYn1ei4R_XXXXXXX"
     *     }
     *   ]
     * }
     */
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'query' => 'required|string',
            ]);

            $query = $request->input('query');
            $apiKey = config('services.google_maps.key');

            $response = Http::get('https://maps.googleapis.com/maps/api/place/textsearch/json', [
                'query' => $query,
                'key' => $apiKey,
            ]);

            $data = $response->json();

            if ($data['status'] !== 'OK') {
                return response()->json([
                    'error' => $data['status'],
                    'message' => $data['error_message'] ?? 'Unknown error',
                ], 400);
            }

            $results = collect($data['results'])->map(fn($place) => [
                'name' => $place['name'],
                'address' => $place['formatted_address'] ?? null,
                'latitude' => $place['geometry']['location']['lat'],
                'longitude' => $place['geometry']['location']['lng'],
                'place_id' => $place['place_id'],
            ]);

            return response()->json([
                'results' => $results,
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
