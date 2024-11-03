<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaLibraryController extends Controller
{
    /**
     * Menampilkan detail media berdasarkan ID.
     *
     * @param  int  $mediaId  ID media yang ingin ditampilkan.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $mediaId, Request $request)
    {
        $media = Media::findOrFail($mediaId);
        return response()->json([
            'data' => $media,
            'status' => 'success',
            'code' => 200,
            'request' => returnConditionIfFalse(app()->environment('development'), $request->all())
        ]);
    }

    /**
     * Menghapus media berdasarkan ID.
     *
     * @param  int  $mediaId  ID media yang ingin dihapus.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete($mediaId)
    {
        $media = Media::findOrFail($mediaId);
        $media->delete();

        return redirect()->back()->with('success', 'Media berhasil dihapus.');
    }
}
