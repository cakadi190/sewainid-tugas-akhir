<?php

namespace App\Helpers;

use App\Interfaces\SecurityHelper as SecurityHelperInterface;
use Illuminate\Http\Request;

class SecurityHelper implements SecurityHelperInterface
{
    /**
     * Determines the number of items per page.
     *
     * @param int $perPage The requested number of items per page.
     * @return int The validated number of items per page, defaults to 10 if not valid.
     */
    public static function getPerPage(int $perPage, ?array $customPagination = []): int
    {
        $allowedValues = $customPagination ?: [5, 10, 25, 30, 40, 50, 75, 100];
        return in_array($perPage, $allowedValues, true) ? $perPage : 10;
    }

    /**
     * Checks security conditions based on cookies in the request.
     *
     * @param Request $request The current HTTP request instance.
     * @param string $dataTargetId The target data ID for security verification.
     * @param string $dataPageTarget The target page for security verification.
     * @return bool True if the security conditions are met, false otherwise.
     */
    public static function securityOpen(string $dataTargetId, string $dataPageTarget, Request $request = null): bool
    {
        $req = $request ?? app(Request::class);
        return !isTruthy($req->cookie('securityOpen')) || ($dataTargetId !== $req->cookie('dataId') && $req->cookie('pageTarget') === $dataPageTarget);
    }
}
