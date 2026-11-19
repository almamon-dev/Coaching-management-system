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
        $user = $request->user();
        $permissions = [];
        if ($user) {
            $rolePerm = \App\Models\RolePermission::where('role', $user->user_type)->first();
            $permissions = $rolePerm ? $rolePerm->permissions : ['dashboard'];
        }

        $allSettings = \App\Models\Setting::pluck('value', 'key')->toArray();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                    'phone' => $user->phone,
                    'profile_picture' => $user->profile_picture,
                    'student_profile' => $user->studentProfile ? $user->studentProfile->load(['course', 'batch']) : null,
                    'teacher_profile' => $user->teacherProfile,
                    'guardian_profile' => $user->guardianProfile ? $user->guardianProfile->load('students') : null,
                    'permissions' => $permissions,
                ] : null,
            ],
            'settings' => array_merge([
                'center_name' => 'Ullash Coaching Center',
                'currency_symbol' => '৳',
                'phone' => '+880 1711-000000',
                'email' => 'info@apexcoaching.bd',
                'address' => 'House 42, Road 11, Block E, Banani, Dhaka',
                'coaching_mode' => 'single',
            ], $allSettings),
            'locale' => app()->getLocale(),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'pendingInquiriesCount' => ($user && in_array($user->user_type, ['super_admin', 'admin', 'manager', 'accountant', 'staff']))
                ? \App\Models\AcademicInquiry::where('status', 'pending')->count()
                : 0,
        ];
    }
}
