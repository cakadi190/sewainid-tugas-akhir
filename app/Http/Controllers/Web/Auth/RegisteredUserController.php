<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegistrationRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegistrationRequest $request): RedirectResponse
    {
        $data = collect($request->validated());

        /** @var User $user */
        $user = User::create($data->except('accept_terms_condition')->toArray());

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard'));
    }
}
