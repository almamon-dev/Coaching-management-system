<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Address;
 
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
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'post_code' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
 
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'user_type' => 'user',
        ]);
 
        // Create initial address
        Address::create([
            'user_id' => $user->id,
            'type' => 'Home',
            'name' => $user->name,
            'address' => $request->address,
            'city' => $request->city,
            'area' => $request->area,
            'post_code' => $request->post_code,
            'is_primary' => true,
        ]);
 
        event(new Registered($user));
 
        Auth::login($user);
 
        return redirect(route('user.addresses', absolute: false));
    }
}
