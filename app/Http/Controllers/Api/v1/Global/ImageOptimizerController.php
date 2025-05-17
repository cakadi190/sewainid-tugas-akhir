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
     * Image Manager instance
     */
    protected ImageManager $imageManager;

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Optimize and resize an image from URL and return it as a data stream
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $validator = $this->validateRequest($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $imageUrl = $request->input('url');
        $width = $request->input('width');
        $height = $request->input('height');
        $quality = $request->input('quality', 80);
        $format = $request->input('format', 'webp');

        try {
            // Fetch image from URL
            $imageData = $this->fetchImageFromUrl($imageUrl);
            if (is_null($imageData)) {
                return response()->json(['error' => 'Failed to fetch the image'], 400);
            }

            // Process the image
            $image = $this->imageManager->read($imageData);

            // Resize the image if needed
            if ($width || $height) {
                $image = $this->resizeImage($image, $width, $height);
            }

            // Encode image to the requested format and get content type
            [$encodedImage, $contentType] = $this->encodeImage($image, $format, $quality);

            // Return the processed image
            return $this->createImageResponse($encodedImage, $contentType, $format);

        } catch (\Exception $e) {
            Log::error('Image optimization error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to optimize image: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Validate the incoming request.
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validateRequest(Request $request)
    {
        return Validator::make($request->all(), [
            'url' => 'required|url',
            'width' => 'nullable|integer|min:1',
            'height' => 'nullable|integer|min:1',
            'quality' => 'nullable|integer|min:1|max:100',
            'format' => 'nullable|in:jpg,jpeg,png,webp',
        ]);
    }

    /**
     * Fetch image from the given URL.
     *
     * @param string $imageUrl
     * @return string|null
     */
    protected function fetchImageFromUrl(string $imageUrl)
    {
        $response = Http::timeout(15)
            ->withoutVerifying()
            ->get($imageUrl);

        return $response->successful() ? $response->body() : null;
    }

    /**
     * Resize the image based on provided dimensions.
     *
     * @param mixed $image Intervention/Image instance
     * @param int|null $width
     * @param int|null $height
     * @return mixed The processed image
     */
    protected function resizeImage($image, $width = null, $height = null)
    {
        if ($width && $height) {
            $image->resize(width: $width, height: $height);
        } elseif ($width && !$height) {
            $image->resize(width: $width);
        } elseif (!$width && $height) {
            $image->resize(height: $height);
        }

        // Check if the image is larger than requested and resize if needed
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

        return $image;
    }

    /**
     * Encode the image to the specified format.
     *
     * @param \Intervention\Image\Interfaces\ImageInterface $image
     * @param string $format
     * @param int $quality
     * @return array [encodedImage, contentType]
     */
    protected function encodeImage($image, string $format, int $quality)
    {
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

        return [$encodedImage, $contentType];
    }

    /**
     * Create the HTTP response with the image.
     *
     * @param mixed $encodedImage Image encoded with Intervention/Image
     * @param string $contentType
     * @param string $format
     * @return \Illuminate\Http\Response
     */
    protected function createImageResponse($encodedImage, string $contentType, string $format)
    {
        $uuid = Uuid::uuid4();

        return response($encodedImage->toString())
            ->header('Content-Type', $contentType)
            ->header('Cache-Control', 'public, max-age=31536000')
            ->header('Content-Disposition', "attachment; filename=\"{$uuid}.{$format}\"");
    }
}
