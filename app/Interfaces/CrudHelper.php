<?php

namespace App\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Interface CrudHelper
 *
 * This interface defines methods for common CRUD (Create, Read, Update, Delete) operations.
 * It provides a standardized way to handle data operations across different models in a Laravel application.
 *
 * @package App\Interfaces
 */
interface CrudHelper
{
    /**
     * Create a new data entry with optional file upload support.
     *
     * This method handles the creation of a new database record using validated request data.
     * It supports file uploads through Laravel MediaLibrary package.
     *
     * @param mixed $request The HTTP request object containing the data to be created.
     *                      This should be type-hinted to a specific FormRequest class
     *                      in the implementing method for proper validation.
     * @param Model $model The model instance for data creation.
     *                     If using MediaLibrary, the model must implement Spatie\MediaLibrary\HasMedia interface.
     * @param array|null $singleUploadTarget Keys for single file upload fields.
     * @param array|null $multipleUploadTarget Keys for multiple file upload fields.
     *
     * @return RedirectResponse Redirects back with success/error messages:
     *                          - Success: Redirects back with a success message
     *                          - Error: Redirects back with error message and input data
     *
     * @throws \Illuminate\Validation\ValidationException If the request validation fails
     * @throws \Exception If MediaLibrary is requested but model doesn't implement HasMedia
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException If file upload fails
     */
    public function createData(mixed $request, Model $model, array|null $singleUploadTarget = [], array|null $multipleUploadTarget = []): RedirectResponse;
    /**
     * Retrieve a single data entry for a given model, including media collections.
     *
     * This method fetches a specific record from the database based on the provided model, and
     * includes associated media collections in the response.
     *
     * The media collections are injected directly into the response data based on the specified
     * single and multiple upload targets.
     *
     * @param Model $model The model instance to retrieve data for, with media collections.
     * @param Request|null $request The HTTP request object (optional). Can be used to specify additional data to include.
     * @param array $singleUploadTarget Names of media collections to retrieve a single media item from (one per collection).
     *                                  Each collection's media item is injected directly into the data with the collection name as the key.
     * @param array|null $multipleUploadTarget Names of media collections to retrieve multiple media items from.
     *                                         Each collection's media items are injected directly into the data as an array, with the collection name as the key.
     * @return JsonResponse A JSON response containing:
     *                      - 'data': The model instance, including media items for specified collections.
     *                      - 'status': A success status message.
     *                      - 'code': The HTTP response code (200 for success).
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the model is not found.
     */
    public function singleData(Model $model, ?Request $request = null, array $singleUploadTarget = [], array $multipleUploadTarget = []): JsonResponse;

    /**
     * Edit data for a given model with optional file upload support.
     *
     * This method updates an existing record in the database using validated request data.
     * It supports optional file uploads via the Laravel MediaLibrary package.
     *
     * @param mixed $request The HTTP request object containing the data to be updated.
     *                      This should be type-hinted to a specific FormRequest class
     *                      in the implementing method for proper validation.
     * @param Model $model The model instance or identifier of the record to be updated.
     *                     If using MediaLibrary, the model must implement Spatie\MediaLibrary\HasMedia interface.
     * @param array|null $singleUploadTarget Keys for single file upload fields.
     * @param array|null $multipleUploadTarget Keys for multiple file upload fields.
     *
     * @return RedirectResponse Redirect response with success/error messages:
     *                          - Success: Redirects back with a success message
     *                          - Error: Redirects back with error message and input data
     *
     * @throws \Illuminate\Validation\ValidationException If the input data fails validation.
     * @throws \Exception If MediaLibrary is requested but model doesn't implement HasMedia.
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException If file upload fails.
     */
    public function editData(mixed $request, Model $model, array|null $singleUploadTarget = [], array|null $multipleUploadTarget = []): RedirectResponse;

    /**
     * Delete data for a given model.
     *
     * This method removes a specific record from the database. It should include checks for
     * whether the deletion is allowed (e.g., user permissions, data dependencies).
     *
     * @param Model $model The model instance or identifier of the record to be deleted.
     * @param mixed $request The HTTP request object. Can be used for authorization checks.
     * @return RedirectResponse A redirect response after the delete operation. This should typically:
     *                          - Redirect to an index page or the previous page
     *                          - Include a success message in the session flash data
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized to perform this action.
     * @throws \Exception If there's an error during the deletion process or if deletion is not allowed due to dependencies.
     */
    function destroyData(Model $model, mixed $request): RedirectResponse;
}
