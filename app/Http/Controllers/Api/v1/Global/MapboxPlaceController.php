<?php

namespace App\Http\Controllers\Api\v1\Global;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Class MapboxPlaceController
 *
 * Controller ini bertugas untuk mencari lokasi menggunakan Mapbox Places API
 * berdasarkan nama tempat yang diberikan user (misalnya: "Gembira Loka Zoo").
 */
class MapboxPlaceController extends Controller
{
    /**
     * Mencari tempat berdasarkan query teks menggunakan Mapbox Places API.
     *
     * Endpoint: GET /places/search?query={nama_tempat}
     *
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
    public function __invoke(Request $request)
    {
        try {
            $request->validate([
                'query' => 'required|string',
            ]);

            $query = $request->input('query');
            $accessToken = config('services.mapbox.key');

            $response = Http::get("https://api.mapbox.com/geocoding/v5/mapbox.places/{$query}.json", [
                'access_token' => $accessToken,
                'limit' => 5,
            ]);

            if ($response->failed()) {
                Log::error('Mapbox error', ['response' => $response]);

                return response()->json(['error' => 'Mapbox error'], 500);
            }

            $data = collect($response['features'])->map(fn (array $item) => [
                'name' => $item['place_name'],
                'longitude' => $item['center'][0],
                'latitude' => $item['center'][1],
            ]);

            return response()->json([
                'results' => $data,
            ]);
        } catch (Exception $e) {
            Log::error('Mapbox error', ['exception' => $e]);

            return response()->json(['error' => 'Mapbox error'], 500);
        }
    }
}
