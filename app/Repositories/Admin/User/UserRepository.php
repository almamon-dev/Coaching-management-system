<?php

declare(strict_types=1);

namespace App\Repositories\Admin\User;

use App\Models\User;
use App\Notifications\StaffInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    /**
     * Get filtered users and statistics.
     */
    public function getUserList(Request $request): array
    {
        $query = User::whereIn('user_type', ['admin', 'staff', 'teacher'])->with(['roles']);

        // Search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Filter by Role
        if ($request->filled('role')) {
            $query->role($request->role);
        }

        // Filter by Status (Tab)
        if ($request->filled('status') && in_array($request->status, ['all', 'today'])) {
            // Check status tab
        } elseif ($request->filled('status') && in_array($request->status, ['active', 'disabled'])) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        if (in_array($sortField, ['name', 'email', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage)->withQueryString();

        // Calculate some basic stats for tabs
        $stats = [
            'all' => User::whereIn('user_type', ['admin', 'staff', 'teacher'])->count(),
            'active' => User::whereIn('user_type', ['admin', 'staff', 'teacher'])->where('status', 'active')->count(),
            'inactive' => User::whereIn('user_type', ['admin', 'staff', 'teacher'])->where('status', 'disabled')->count(),
        ];

        return compact('users', 'stats');
    }

    /**
     * Create a new administrative user and send invitation.
     */
    public function create(array $data): User
    {
        $preVerified = filter_var($data['pre_verified'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $status = !$preVerified ? 'disabled' : ($data['status'] ?? 'active');

        $user = User::create([
            'name'              => $data['name'],
            'email'             => $data['email'],
            'password'          => Hash::make($data['password']),
            'user_type'         => 'admin',
            'status'            => $status,
            'email_verified_at' => $preVerified ? now() : null,
            'is_verified'       => $preVerified,
            'verified_at'       => $preVerified ? now() : null,
            'parent_id'         => auth()->id(),
        ]);

        // Sync Roles
        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        // Send temporary invitation if not pre-verified
        if (!$preVerified && auth()->check()) {
            $user->notify(new StaffInvitationNotification(auth()->user()));
        }

        return $user;
    }

    /**
     * Update administrative user attributes and roles.
     */
    public function update(User $user, array $data): bool
    {
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->status = $data['status'] ?? $user->status;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        if (isset($data['roles'])) {
            // Prevent stripping Super Admin role from the original admin
            $roles = $data['roles'];
            if ($user->email === 'admin@getitmoving.com' && !in_array('Super Admin', $roles)) {
                $roles[] = 'Super Admin';
            }
            $user->syncRoles(array_unique($roles));
        }

        return true;
    }

    /**
     * Delete an administrative user.
     */
    public function delete(User $user): bool
    {
        // Protect primary admin and self
        if ($user->email === 'admin@getitmoving.com' || $user->id === auth()->id()) {
            return false;
        }

        return (bool) $user->delete();
    }

    /**
     * Bulk delete administrative users.
     */
    public function bulkDelete(array $ids): int
    {
        $protectedUser = User::where('email', 'admin@getitmoving.com')->first();
        $protectedIds = array_filter(array_unique([auth()->id(), $protectedUser?->id]));

        $targetIds = array_diff($ids, $protectedIds);

        if (empty($targetIds)) {
            return 0;
        }

        return User::whereIn('id', $targetIds)->whereIn('user_type', ['admin', 'staff', 'teacher'])->delete();
    }

    /**
     * Bulk update status for administrative users.
     */
    public function bulkUpdateStatus(array $ids, string $status): int
    {
        $protectedUser = User::where('email', 'admin@getitmoving.com')->first();
        $protectedIds = array_filter(array_unique([auth()->id(), $protectedUser?->id]));

        $targetIds = array_diff($ids, $protectedIds);

        if (empty($targetIds)) {
            return 0;
        }

        return User::whereIn('id', $targetIds)->whereIn('user_type', ['admin', 'staff', 'teacher'])->update(['status' => $status]);
    }
}
