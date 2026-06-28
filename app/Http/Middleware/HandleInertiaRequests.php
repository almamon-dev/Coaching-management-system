<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $isAdmin = $request->is('admin*') || $request->is('api/admin*');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'user_type' => $request->user()->user_type,
                    'designation' => $request->user()->designation,
                    'phone' => $request->user()->phone,

                    'profile_picture' => \App\Support\Media\FileUrlGenerator::generate($request->user()->profile_picture),
                    'notifications' => \Illuminate\Support\Facades\Cache::remember("user_notifications_{$request->user()->id}", 15, function () use ($request) {
                        return $request->user()->unreadNotifications()->limit(10)->get();
                    }),
                    'unread_notifications_count' => \Illuminate\Support\Facades\Cache::remember("user_notifications_count_{$request->user()->id}", 15, function () use ($request) {
                        return $request->user()->unreadNotifications()->count();
                    }),
                    'roles' => \Illuminate\Support\Facades\Cache::remember("user_roles_{$request->user()->id}", 300, function () use ($request) {
                        return $request->user()->roles->pluck('name')->toArray();
                    }),
                    'permissions' => \Illuminate\Support\Facades\Cache::remember("user_permissions_{$request->user()->id}", 300, function () use ($request) {
                        return $request->user()->getAllPermissions()->pluck('name')->toArray();
                    }),
                ] : null,
            ],
            'settings' => [
                'site_name' => config('app.name', 'School Management'),
            ],
            'current_academic_session' => \Illuminate\Support\Facades\Cache::remember('current_academic_session', 3600, function () {
                return \App\Models\AcademicSession::where('is_current', true)->first();
            }),
            'locale' => app()->getLocale(),
            'translations' => \Illuminate\Support\Facades\Cache::remember('lang_' . app()->getLocale(), 600, function () {
                $path = base_path('lang/' . app()->getLocale() . '.json');
                return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
            }),

            'pages' => $isAdmin ? [] : \Illuminate\Support\Facades\Cache::remember('global_pages_list', 3600, function () {
                return \App\Models\Page::select('id', 'title', 'slug')->where('is_active', true)->get();
            }),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
