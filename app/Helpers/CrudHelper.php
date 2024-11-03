<?php

namespace App\Helpers;

use App\Interfaces\CrudHelper as CrudInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;

/**
 * Class CrudHelper
 *
 * Helper untuk menjalankan operasi CRUD (Create, Read, Update, Delete)
 * dengan integrasi pada Eloquent Model.
 *
 * @package App\Helpers
 */
class CrudHelper implements CrudInterface
{
    /**
     * Create a new record in the model with optional file upload support.
     *
     * @param mixed $request The HTTP request with data for creation
     * @param Model $model The model instance for data creation
     * @param array|null $singleUploadTarget Keys for single file upload
     * @param array|null $multipleUploadTarget Keys for multiple file upload
     * @return RedirectResponse
     */
    public function createData(mixed $request, Model $model, array|null $singleUploadTarget = [], array|null $multipleUploadTarget = []): RedirectResponse
    {
        try {
            $data = collect($request->validated());

            // Create the model with the processed data
            $createdModel = $model->create($data->toArray());

            // Handle file uploads with MediaLibrary if required
            if ($singleUploadTarget || $multipleUploadTarget) {
                // Ensure model implements HasMedia interface
                if (!($model instanceof HasMedia)) {
                    throw new \Exception('Model must implement HasMedia interface to use MediaLibrary');
                }

                $files = collect($request->allFiles());

                if ($files->isNotEmpty()) {
                    // Handle multiple file uploads
                    $files->each(function ($file, $key) use ($createdModel, $multipleUploadTarget) {
                        if (in_array($key, $multipleUploadTarget) && is_array($file)) {
                            foreach ($file as $singleFile) {
                                if ($singleFile->isValid()) {
                                    $fileName = Str::uuid() . '.' . $singleFile->getClientOriginalExtension();
                                    $createdModel->addMedia($singleFile)
                                        ->usingFileName($fileName)
                                        ->toMediaCollection($key);
                                }
                            }
                        }
                    });

                    // Handle single file uploads
                    $files->each(function ($file, $key) use ($createdModel, $singleUploadTarget) {
                        if (in_array($key, $singleUploadTarget) && $file->isValid()) {
                            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
                            $createdModel->addMedia($file)
                                ->usingFileName($fileName)
                                ->toMediaCollection($key);
                        }
                    });
                }
            }

            return redirect()->back()->with('success', 'Data berhasil ditambahkan!');
        } catch (\Throwable $th) {
            Log::error($th);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat menambahkan data. Silakan coba lagi!']);
        }
    }

    /**
     * Retrieve a single data entry for a given model in JSON format.
     *
     * @param Model $model The model instance to retrieve data for.
     * @param Request|null $request Optional request object.
     * @param array $singleUploadTarget Collection names for single upload targets.
     * @param array|null $multipleUploadTarget Collection names for multiple upload targets.
     * @return JsonResponse JSON response with the single data entry.
     */
    public function singleData(Model $model, Request|null $request = null, array $singleUploadTarget = [], array|null $multipleUploadTarget = []): JsonResponse
    {
        $data = ($model instanceof HasMedia) ? $model->toArray() : $model;

        // Inject single upload target media directly into data
        foreach ($singleUploadTarget as $target) {
            $mediaItem = $model->getFirstMedia($target);
            $data[$target] = $mediaItem->toArray();
        }

        // Inject multiple upload target media directly into data
        foreach ($multipleUploadTarget as $target) {
            $mediaItems = $model->getMedia($target);
            $data[$target] = $mediaItems->toArray();
        }

        return response()->json([
            'data' => $data,
            'status' => 'success',
            'code' => 200,
            'request' => returnConditionIfFalse(app()->environment('development'), $request->all())
        ]);
    }

    /**
     * Update an existing data record for a given model with optional file upload support.
     *
     * @param mixed $request The HTTP request with data for update.
     * @param Model $model The model instance to be updated.
     * @param array|null $singleUploadTarget Keys for single file upload
     * @param array|null $multipleUploadTarget Keys for multiple file upload
     * @return RedirectResponse Redirect response with success or error messages.
     */
    public function editData(mixed $request, Model $model, array|null $singleUploadTarget = [], array|null $multipleUploadTarget = []): RedirectResponse
    {
        try {
            if ($request->has('restore')) {
                $model->restore();
                return redirect()->back()->with('success', "Data berhasil dipulihkan!");
            }

            // Update model with validated data
            $model->update($request->validated());

            // Handle file uploads with MediaLibrary if required
            if ($singleUploadTarget || $multipleUploadTarget) {
                if (!($model instanceof HasMedia)) {
                    throw new \Exception('Model must implement HasMedia interface to use MediaLibrary');
                }

                $files = collect($request->allFiles());

                if ($files->isNotEmpty()) {
                    // Handle multiple file uploads
                    $files->each(function ($file, $key) use ($model, $multipleUploadTarget) {
                        if (in_array($key, $multipleUploadTarget) && is_array($file)) {
                            foreach ($file as $singleFile) {
                                if ($singleFile->isValid()) {
                                    $fileName = Str::uuid() . '.' . $singleFile->getClientOriginalExtension();
                                    $model->addMedia($singleFile)
                                        ->usingFileName($fileName)
                                        ->toMediaCollection($key);
                                }
                            }
                        }
                    });

                    // Handle single file uploads
                    $files->each(function ($file, $key) use ($model, $singleUploadTarget) {
                        if (in_array($key, $singleUploadTarget) && $file->isValid()) {
                            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
                            $model->addMedia($file)
                                ->usingFileName($fileName)
                                ->toMediaCollection($key);
                        }
                    });
                }
            }

            return redirect()->back()->with('success', "Data berhasil diperbarui!");
        } catch (\Throwable $th) {
            Log::error($th);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => "Terjadi kesalahan saat memperbarui data. Silakan coba lagi!"]);
        }
    }

    /**
     * Delete a data record for a given model.
     *
     * @param Model $model The model instance to be deleted.
     * @param mixed $request The HTTP request.
     * @return RedirectResponse Redirect response with success or error messages.
     */
    public function destroyData(Model $model, mixed $request): RedirectResponse
    {
        try {
            if ($request->boolean('forceDelete')) {
                $model->forceDelete();
                return redirect()->back()->with('success', "Data berhasil dihapus permanen!");
            } else {
                $model->delete();
                return redirect()->back()->with('success', "Data berhasil dihapus sementara!");
            }
        } catch (\Throwable $th) {
            Log::error($th);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => "Terjadi kesalahan saat menghapus data. Silakan coba lagi!"]);
        }
    }
}
