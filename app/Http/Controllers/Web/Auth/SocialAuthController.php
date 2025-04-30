<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class SocialAuthController extends Controller
{
    /**
     * Daftar social provider yang diizinkan
     *
     * @var array
     */
    protected $allowedProviders = ['google'];

    /**
     * Redirect the user to the authentication page.
     *
     * @param string $provider
     * @return SymfonyRedirectResponse
     */
    public function redirect(string $provider = 'google'): SymfonyRedirectResponse
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the incoming request after authentication.
     *
     * @param string $provider
     * @return RedirectResponse
     */
    public function callback(string $provider = 'google'): RedirectResponse
    {
        $this->validateProvider($provider);

        $socialAccount = Socialite::driver($provider)->user();

        $user = User::where('email', $socialAccount->getEmail())->first();

        if ($user) {
            $user->update([
                'google_id' => $socialAccount->getId(),
                'avatar' => $socialAccount->getAvatar(),
            ]);
        } else {
            $user = User::create([
                'email' => $socialAccount->getEmail(),
                'name' => $socialAccount->getName(),
                'google_id' => $socialAccount->getId(),
                'email_verified_at' => now(),
                'password' => bcrypt(Str::random(16)),
                'avatar' => $socialAccount->getAvatar(),
            ]);
        }

        Auth::login($user, true);

        return redirect()->route('dashboard')
            ->with('success', "Berhasil melakukan autentikasi dengan akun {$provider} Anda!");
    }

    /**
     * Validates if the given provider is allowed.
     *
     * @param string $provider
     * @return void
     */
    protected function validateProvider(string $provider): void
    {
        if (!in_array($provider, $this->allowedProviders)) {
            abort(403, 'Hanya autentikasi ' . implode(', ', $this->allowedProviders) . ' yang dapat diproses!');
        }
    }
}
