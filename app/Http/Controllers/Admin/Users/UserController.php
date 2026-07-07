<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\User\IndexUserService;
use App\Services\Admin\User\StoreUserService;
use App\Services\Admin\User\UpdateUserService;
use App\Services\Admin\User\DestroyUserService;
use App\Services\Admin\User\BulkDestroyUserService;
use App\Services\Admin\User\BulkUpdateUserStatusService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of admin users.
     */
    public function index(Request $request, IndexUserService $service): InertiaResponse
    {
        $result = $service->execute($request);
        $roles = Role::select('id', 'name')->get();

        return Inertia::render('Admin/Users/List/UserListPage', [
            'users'   => $result['users'],
            'filters' => $request->only(['search', 'role', 'status', 'sort_field', 'sort_direction', 'per_page']),
            'stats'   => $result['stats'],
            'roles'   => $roles,
        ]);
    }

    /**
     * Show the form for creating a new admin user.
     */
    public function create(): InertiaResponse
    {
        $roles = Role::select('id', 'name')->get();
        $existingUsers = User::whereIn('user_type', ['admin', 'staff', 'teacher'])
            ->with(['roles:id,name'])
            ->select('id', 'name', 'email', 'user_type')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Users/Create/UserCreatePage', [
            'roles' => $roles,
            'existingUsers' => $existingUsers,
        ]);
    }

    /**
     * Store a newly created admin user in storage.
     */
    public function store(Request $request, StoreUserService $service): RedirectResponse
    {
        $preVerified = filter_var($request->input('pre_verified', false), FILTER_VALIDATE_BOOLEAN);

        $isExisting = $request->filled('existing_user_id');

        $rules = [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255' . ($isExisting ? '' : '|unique:users'),
            'password' => $isExisting ? ['nullable', 'confirmed', Rules\Password::defaults()] : ['required', 'confirmed', Rules\Password::defaults()],
            'roles'    => 'required|array',
            'user_type' => 'nullable|in:admin,staff,teacher',
            'status'   => !$preVerified ? 'nullable' : 'required|in:active,disabled',
            'existing_user_id' => 'nullable|exists:users,id'
        ];

        $validated = $request->validate($rules);

        $validated['pre_verified'] = $preVerified;

        if ($isExisting) {
            $user = User::findOrFail($validated['existing_user_id']);
            // update existing user
            app(\App\Services\Admin\User\UpdateUserService::class)->execute($user, $validated);
        } else {
            $service->execute($validated);
        }

        return redirect()->route('admin.users.index')
            ->with('success', !$preVerified
                ? 'Invitation sent successfully. Profile is pending verification.'
                : 'User successfully created and roles assigned.');
    }

    /**
     * Show the form for editing the specified admin user.
     */
    public function edit(User $user): InertiaResponse
    {
        // Don't edit customers through this administrative staff portal
        if (!in_array($user->user_type, ['admin', 'staff'])) {
            abort(403, 'Unauthorized access.');
        }

        $roles = Role::select('id', 'name')->get();
        $userRoles = $user->roles->pluck('name')->toArray();

        return Inertia::render('Admin/Users/Edit/UserEditPage', [
            'user'      => $user,
            'userRoles' => $userRoles,
            'roles'     => $roles,
        ]);
    }

    /**
     * Update the specified admin user in storage.
     */
    public function update(Request $request, User $user, UpdateUserService $service): RedirectResponse
    {
        if (!in_array($user->user_type, ['admin', 'staff'])) {
            abort(403, 'Unauthorized access.');
        }

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'roles'    => 'required|array',
            'user_type' => 'required|in:admin,staff',
            'status'   => 'required|in:active,disabled',
        ]);

        $service->execute($user, $validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated and roles synced successfully.');
    }

    /**
     * Remove the specified admin user from storage.
     */
    public function destroy(User $user, DestroyUserService $service): RedirectResponse
    {
        if (!in_array($user->user_type, ['admin', 'staff'])) {
            abort(403, 'Unauthorized access.');
        }

        $deleted = $service->execute($user);

        if (!$deleted) {
            return redirect()->back()->with('error', 'Cannot delete this protected user.');
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User successfully deleted.');
    }

    /**
     * Remove multiple admin users in bulk.
     */
    public function bulkDestroy(Request $request, BulkDestroyUserService $service): RedirectResponse
    {
        $ids = $request->input('ids', []);

        $deletedCount = $service->execute($ids);

        if ($deletedCount > 0) {
            return redirect()->route('admin.users.index')
                ->with('success', $deletedCount . ' staff users deleted successfully.');
        }

        return redirect()->route('admin.users.index')
            ->with('error', 'No valid staff users selected for deletion.');
    }

    /**
     * Update status for multiple admin users in bulk.
     */
    public function bulkUpdateStatus(Request $request, BulkUpdateUserStatusService $service): RedirectResponse
    {
        $ids = $request->input('ids', []);
        $status = $request->input('status');

        if (!in_array($status, ['active', 'disabled'])) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Invalid status selected.');
        }

        $updatedCount = $service->execute($ids, $status);

        if ($updatedCount > 0) {
            return redirect()->route('admin.users.index')
                ->with('success', $updatedCount . ' staff users status updated successfully.');
        }

        return redirect()->route('admin.users.index')
            ->with('error', 'No valid staff users selected for status update.');
    }

    /**
     * Show the acceptance form for staff invitations (Auto-verifies & activates).
     */
    public function showAcceptInvitation(Request $request, User $user): RedirectResponse
    {
        // 1. Verify URL has a valid signed signature and hasn't expired
        if (! $request->hasValidSignature()) {
            abort(403, 'This invitation link has expired or is invalid.');
        }

        // 2. Prevent already verified users from accepting again
        if ($user->is_verified || $user->email_verified_at) {
            return redirect()->route('admin.login')->with('status', 'Invitation already accepted. Please sign in with your credentials.');
        }

        // 3. Auto-verify email and make account active
        $user->update([
            'is_verified'       => true,
            'email_verified_at' => now(),
            'verified_at'       => now(),
            'status'            => 'active',
        ]);

        return redirect()->route('admin.login')->with('status', 'Your email has been verified and your account is active! You can now log in using your temporary password.');
    }
}
