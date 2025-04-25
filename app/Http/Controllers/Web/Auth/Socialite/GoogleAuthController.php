<?php

namespace App\Http\Controllers\Web\Auth\Socialite;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirect()
    {
        return Socialite::driver("google")->redirect();
    }

    /**
     * Handle the incoming request.
     *
     * @return \Illuminate\Http\RedirectResponse|null|void
     */
    public function callback()
    {
        $googleUser = Socialite::driver('google')->user();

        if($googleUser->getEmail() == null || User::where('email', $googleUser->getEmail())->count() === 0) {
            return redirect()->route('register')->with('error','Anda belum terdaftar sebagai pengguna. Silahkan mendaftar terlebih dahulu!');
        }

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'email_verified_at' => now(),
                'password' => bcrypt(Str::random(16)),
                'avatar' => $googleUser->getAvatar(),
            ]
        );

        Auth::login($user, true);
    }
}
