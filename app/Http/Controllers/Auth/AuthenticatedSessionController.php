<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class AuthenticatedSessionController
 * @package App\Http\Controllers\Auth
 *
 * Handles user authentication and session management.
 * This controller provides methods for displaying the login form,
 * processing login requests, redirecting users based on their roles,
 * and logging out users.
 */
class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     *
     * This method renders the login page using Inertia.
     * It checks if the password reset route exists and passes this information
     * to the view, along with any status messages stored in the session.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     *
     * This method validates the incoming login request using the LoginRequest.
     * If authentication is successful, the session is regenerated to prevent session fixation attacks.
     * The user is then redirected to their appropriate landing page based on their role.
     *
     * @param LoginRequest $request The validated login request.
     * @return RedirectResponse Redirects the user after authentication.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return $this->redirectUser($request);
    }

    /**
     * Handle Redirect based on user role.
     *
     * This private method determines where to redirect the user after successful login
     * based on their role. It checks the user's role attribute and redirects
     * to either the administrator dashboard or the regular user dashboard.
     *
     * @param LoginRequest $request The validated login request.
     * @return RedirectResponse The redirect response based on user role.
     */
    private function redirectUser(LoginRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // If the user is not an admin
        if ($user->getAttribute('role') !== 'user') {
            return redirect()->intended(route('administrator', absolute: false));
        }

        // Otherwise, redirect to the user dashboard
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     *
     * This method handles the logout process for the user. It invalidates the user's session,
     * regenerates the CSRF token, and redirects the user to the homepage.
     *
     * @param Request $request The incoming request instance.
     * @return RedirectResponse Redirects the user to the homepage after logout.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
