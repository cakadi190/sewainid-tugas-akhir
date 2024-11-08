<?php

namespace App\Helpers;

use App\Interfaces\SecurityHelper as SecurityHelperInterface;
use Illuminate\Http\Request;

class SecurityHelper implements SecurityHelperInterface
{
    /**
     * Menentukan jumlah item per halaman.
     *
     * @param int $perPage Jumlah item per halaman yang diminta.
     * @return int Jumlah item per halaman yang divalidasi, default 10 jika tidak valid.
     */
    public static function getPerPage(int $perPage, ?array $customPagination = []): int
    {
        $allowedValues = $customPagination ?? [5, 10, 25, 30, 40, 50, 75, 100];
        return in_array($perPage, $allowedValues) ? $perPage : 10;
    }

    /**
     * Memeriksa kondisi keamanan berdasarkan cookie dalam request.
     *
     * @param Request $request Instansi request HTTP saat ini.
     * @param string $dataTargetId ID data target untuk verifikasi keamanan.
     * @param string $dataPageTarget Halaman target untuk verifikasi keamanan.
     * @return bool True jika kondisi keamanan terpenuhi, false jika tidak.
     */
    public static function securityOpen(string $dataTargetId, string $dataPageTarget, Request $request = null): bool
    {
        $req = $request ?? app(Request::class);
        return !$req->cookie('securityOpen') || ($dataTargetId !== $req->cookie('dataId') && $req->cookie('pageTarget') === $dataPageTarget);
    }
}
