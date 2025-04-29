<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Str;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirect(string $social = 'google')
    {
        if($social !== 'google') {
            abort(403, 'Only google auth can be processed!');
        }

        return Socialite::driver($social)->redirect();
    }

    /**
     * Handle the incoming request.
     *
     * @return \Illuminate\Http\RedirectResponse|null|void
     */
    public function callback(string $social = 'google')
    {
        if($social !== 'google') {
            abort(403, 'Only google auth can be processed!');
        }

        $socialAccount = Socialite::driver($social)->user();

        $user = User::updateOrCreate(
            [
                'email' => $socialAccount->getEmail(),
                'name' => $socialAccount->getName(),
            ],
            [
                'google_id' => $socialAccount->getId(),
                'email_verified_at' => now(),
                'password' => bcrypt(Str::random(16)),
                'avatar' => $socialAccount->getAvatar(),
            ]
        );

        Auth::login($user, true);

        return redirect()->route('dashboard')->with('success','Berhasil melakukan autentikasi dengan akun google anda!');
    }
}
