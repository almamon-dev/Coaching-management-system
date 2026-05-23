<?php

namespace App\Repositories\Admin\Role;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleRepository
{
    /**
     * Get filtered roles and statistics.
     */
    public function getRoleList(Request $request): array
    {
        $query = Role::withCount(['users', 'permissions'])
            ->with(['permissions', 'users:id,name,email,profile_picture']);

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Advanced Filters: Operators
        if ($request->filled('operators') && $request->operators !== 'all') {
            if ($request->operators === 'none') {
                $query->has('users', '=', 0);
            } elseif ($request->operators === 'some') {
                $query->has('users', '>', 0);
            }
        }

        // Advanced Filters: Permissions
        if ($request->filled('permissions') && $request->permissions !== 'all') {
            if ($request->permissions === 'none') {
                $query->has('permissions', '=', 0);
            } elseif ($request->permissions === 'some') {
                $query->has('permissions', '>', 0);
            }
        }

        // Tab Filters
        if ($request->filled('tab') && $request->tab !== 'all') {
            switch ($request->tab) {
                case 'operators':
                    $query->has('users', '>', 0);
                    break;
                case 'empty':
                    $query->has('users', '=', 0);
                    break;
                case 'permissions':
                    $query->has('permissions', '>', 0);
                    break;
                case 'no_permissions':
                    $query->has('permissions', '=', 0);
                    break;
            }
        }

        // Sorting
        $sortBy = $request->sort_by ?? 'latest';
        switch ($sortBy) {
            case 'oldest':
                $query->oldest();
                break;
            case 'name_az':
                $query->orderBy('name', 'asc');
                break;
            case 'name_za':
                $query->orderBy('name', 'desc');
                break;
            case 'users_high':
                $query->orderBy('users_count', 'desc');
                break;
            case 'users_low':
                $query->orderBy('users_count', 'asc');
                break;
            case 'permissions_high':
                $query->orderBy('permissions_count', 'desc');
                break;
            case 'permissions_low':
                $query->orderBy('permissions_count', 'asc');
                break;
            case 'latest':
            default:
                $query->latest();
                break;
        }

        $roles = $query->cursorPaginate($request->per_page ?? 10)->withQueryString();

        $stats = [
            'all' => Role::count(),
            'with_operators' => Role::has('users', '>', 0)->count(),
            'without_operators' => Role::has('users', '=', 0)->count(),
            'with_permissions' => Role::has('permissions', '>', 0)->count(),
            'without_permissions' => Role::has('permissions', '=', 0)->count(),
        ];

        return compact('roles', 'stats');
    }
}
