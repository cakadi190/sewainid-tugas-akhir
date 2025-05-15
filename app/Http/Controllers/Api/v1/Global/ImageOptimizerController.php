<?php

namespace App\Http\Controllers\Api\v1\Global;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Uuid;

class ImageOptimizerController extends Controller
{
    /**
     * Optimize and resize an image from URL and return it as a data stream
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function optimize(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|url',
            'width' => 'nullable|integer|min:1',
            'height' => 'nullable|integer|min:1',
            'quality' => 'nullable|integer|min:1|max:100',
            'format' => 'nullable|in:jpg,jpeg,png,webp',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $imageUrl = $request->input('url');
        $width = $request->input('width');
        $height = $request->input('height');
        $quality = $request->input('quality', 80);
        $format = $request->input('format', 'webp');

        try {
            $response = Http::timeout(15)
                ->withoutVerifying()
                ->get($imageUrl);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch the image'], 400);
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($response->body());

            if ($width || $height) {
                if ($width && $height) {
                    $image->resize(width: $width, height: $height);
                } elseif ($width && !$height) {
                    $image->resize(width: $width);
                } elseif (!$width && $height) {
                    $image->resize(height: $height);
                }

                $currentWidth = $image->width();
                $currentHeight = $image->height();

                if (($width && $currentWidth > $width) || ($height && $currentHeight > $height)) {
                    if ($width && !$height) {
                        $image->resize(width: min($width, $currentWidth));
                    } elseif (!$width && $height) {
                        $image->resize(height: min($height, $currentHeight));
                    } else {
                        $image->resize(
                            width: min($width, $currentWidth),
                            height: min($height, $currentHeight)
                        );
                    }
                }
            }

            $contentType = match ($format) {
                'jpg', 'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                default => 'image/webp',
            };

            $encodedImage = match ($format) {
                'jpg', 'jpeg' => $image->toJpeg($quality),
                'png' => $image->toPng(),
                'webp' => $image->toWebp($quality),
                default => $image->toWebp($quality),
            };

            $uuid = Uuid::uuid4();

            return response($encodedImage->toString())
                ->header('Content-Type', $contentType)
                ->header('Cache-Control', 'public, max-age=31536000')
                ->header('Content-Disposition', "attachment; filename=\"{$uuid}.{$format}\"");

        } catch (\Exception $e) {
            Log::error('Image optimization error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to optimize image: ' . $e->getMessage()], 500);
        }
    }
}

