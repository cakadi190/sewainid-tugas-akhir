<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param array<int, string> $roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Anda belum masuk! Silahkan autentikasikan diri anda terlebih dahulu.');
        }

        if (!in_array($user->role->value, $roles)) {
            abort(403);
        }

        return $next($request);
    }
}
