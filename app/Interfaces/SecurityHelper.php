<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface SecurityHelper
{
    /**
     * Determines the number of items per page.
     *
     * @param int $perPage The requested number of items per page.
     * @param array<int>|null $customPagination Custom pagination values.
     * @return int The validated number of items per page, defaults to 10 if not valid.
     */
    public static function getPerPage(int $perPage, ?array $customPagination = []): int;

    /**
     * Checks security conditions based on cookies in the request.
     *
     * @param string $dataTargetId The target data ID for security verification.
     * @param string $dataPageTarget The target page for security verification.
     * @param Request|null $request The current HTTP request instance, defaults to null to use the app instance.
     * @return bool True if the security conditions are met, false otherwise.
     */
    public static function securityOpen(string $dataTargetId, string $dataPageTarget, Request $request = null): bool;
}
