<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'isAdmin' => Route::currentRouteName() === 'admin.login',
            'isTeacher' => Route::currentRouteName() === 'teacher.login',
            'isStudent' => Route::currentRouteName() === 'student.login',
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
 
        $user = auth()->user();
        $routeName = Route::currentRouteName();
        // Portal-specific authorization
        $adminRolesCount = $user->roles()->whereNotIn('name', ['teacher', 'student', 'user'])->count();
        $hasAdminAccess = in_array($user->user_type, ['admin', 'staff']) || $adminRolesCount > 0;

        if (in_array($routeName, ['admin.login', 'admin.login.store']) && !$hasAdminAccess) {
            Auth::guard('web')->logout();
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        if (in_array($routeName, ['teacher.login', 'teacher.login.store']) && !in_array($user->user_type, ['staff', 'teacher'])) {
            Auth::guard('web')->logout();
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        if (in_array($routeName, ['student.login', 'student.login.store']) && in_array($user->user_type, ['admin', 'staff', 'teacher'])) {
            Auth::guard('web')->logout();
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $request->session()->regenerate();
 
        // Redirect based on the portal they logged into
        if (in_array($routeName, ['admin.login', 'admin.login.store'])) {
            $url = route('admin.dashboard', absolute: false);
        } elseif (in_array($routeName, ['teacher.login', 'teacher.login.store'])) {
            $url = route('teacher.dashboard', absolute: false);
        } else {
            $url = route('user.dashboard', absolute: false);
        }
 
        return redirect()->to($url);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
