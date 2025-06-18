<?php

namespace App\Helpers;

use App\Interfaces\CrudHelper as CrudInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Symfony\Component\HttpFoundation\Response;

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
     * Create a new record in the model with optional file upload and callback support.
     *
     * @param mixed $request The HTTP request with data for creation
     * @param Model $model The model instance for data creation
     * @param array|null $singleUploadTarget Keys for single file upload
     * @param array|null $multipleUploadTarget Keys for multiple file upload
     * @param callable|null $beforeCreating Optional callback to execute before creating the data
     * @param callable|null $afterCreating Optional callback to execute after creating the data
     * @return RedirectResponse
     */
    public function createData(
        mixed $request,
        Model $model,
        array|null $singleUploadTarget = [],
        array|null $multipleUploadTarget = [],
        ?callable $beforeCreating = null,
        ?callable $afterCreating = null
    ): RedirectResponse {
        try {
            $data = collect($request->validated());

            // Execute the beforeCreating callback if provided
            if (is_callable($beforeCreating)) {
                $beforeCreating($model);
            }

            // Create the model with the processed data
            $createdModel = $model->create($data->toArray());

            // Handle file uploads with MediaLibrary if required
            if ($singleUploadTarget || $multipleUploadTarget) {
                if (!($model instanceof HasMedia)) {
                    throw new \Exception('Model must implement HasMedia interface to use MediaLibrary');
                }

                $files = collect($request->allFiles());

                // Handle file uploads in a more efficient way
                $uploadTargets = array_merge($singleUploadTarget, $multipleUploadTarget);
                $files->each(function ($file, $key) use ($createdModel, $uploadTargets) {
                    if (in_array($key, $uploadTargets)) {
                        if (is_array($file)) {
                            foreach ($file as $singleFile) {
                                if ($singleFile->isValid()) {
                                    $fileName = Str::uuid() . '.' . $singleFile->getClientOriginalExtension();
                                    $createdModel->addMedia($singleFile)
                                        ->usingFileName($fileName)
                                        ->toMediaCollection($key);
                                }
                            }
                        } else if ($file->isValid()) {
                            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
                            $createdModel->addMedia($file)
                                ->usingFileName($fileName)
                                ->toMediaCollection($key);
                        }
                    }
                });
            }

            // Execute the afterCreating callback if provided
            if (is_callable($afterCreating)) {
                $afterCreating($createdModel);
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

        // Inject single and multiple upload target media directly into data in a more efficient way
        $uploadTargets = array_merge($singleUploadTarget, $multipleUploadTarget);
        foreach ($uploadTargets as $target) {
            $mediaItems = $model->getMedia($target);
            $data[$target] = $mediaItems->toArray();
        }

        return response()->json([
            'data' => $data,
            'status' => 'success',
            'code' => Response::HTTP_OK,
            'request' => returnConditionIfFalse(app()->environment('development'), $request->all())
        ]);
    }

    /**
     * Update an existing data record with optional file upload and callback support.
     *
     * @param mixed $request The HTTP request with data for update
     * @param Model $model The model instance to be updated
     * @param array|null $singleUploadTarget Keys for single file upload
     * @param array|null $multipleUploadTarget Keys for multiple file upload
     * @param callable|null $beforeUpdating Optional callback to execute before updating the data
     * @param callable|null $afterUpdating Optional callback to execute after updating the data
     * @return RedirectResponse
     */
    public function editData(
        mixed $request,
        Model $model,
        array|null $singleUploadTarget = [],
        array|null $multipleUploadTarget = [],
        ?callable $beforeUpdating = null,
        ?callable $afterUpdating = null
    ): RedirectResponse {
        try {
            if ($request->has('restore')) {
                $model->restore();
                return redirect()->back()->with('success', "Data berhasil dipulihkan!");
            }

            // Execute the beforeUpdating callback if provided
            if (is_callable($beforeUpdating)) {
                $beforeUpdating($model);
            }

            // Update model with validated data
            $model->update($request->validated());

            // Handle file uploads with MediaLibrary if required
            if ($singleUploadTarget || $multipleUploadTarget) {
                if (!($model instanceof HasMedia)) {
                    throw new \Exception('Model must implement HasMedia interface to use MediaLibrary');
                }

                $files = collect($request->allFiles());

                // Handle file uploads in a more efficient way
                $uploadTargets = array_merge($singleUploadTarget, $multipleUploadTarget);
                $files->each(function ($file, $key) use ($model, $uploadTargets) {
                    if (in_array($key, $uploadTargets)) {
                        if (is_array($file)) {
                            foreach ($file as $singleFile) {
                                if ($singleFile->isValid()) {
                                    $fileName = Str::uuid() . '.' . $singleFile->getClientOriginalExtension();
                                    $model->addMedia($singleFile)
                                        ->usingFileName($fileName)
                                        ->toMediaCollection($key);
                                }
                            }
                        } else if ($file->isValid()) {
                            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
                            $model->addMedia($file)
                                ->usingFileName($fileName)
                                ->toMediaCollection($key);
                        }
                    }
                });
            }

            // Execute the afterUpdating callback if provided
            if (is_callable($afterUpdating)) {
                $afterUpdating($model);
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
            } else if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses($model))) {
                $model->delete();
                return redirect()->back()->with('success', "Data berhasil dihapus sementara!");
            } else {
                $model->delete();
                return redirect()->back()->with('success', "Data berhasil dihapus!");
            }
        } catch (\Throwable $th) {
            Log::error($th);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => "Terjadi kesalahan saat menghapus data. Silakan coba lagi!"]);
        }
    }
}

