<?php

namespace App\Http\Controllers\Admin\Roles;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request, \App\Repositories\Admin\Role\RoleRepository $repository)
    {
        $result = $repository->getRoleList($request);

        return Inertia::render('Admin/Roles/List/RoleListPage', [
            'roles' => $result['roles'],
            'filters' => $request->only(['search', 'per_page', 'sort_by', 'operators', 'permissions', 'tab']),
            'stats' => $result['stats'],
        ]);
    }

    /**
     * Display the specified role details.
     */
    public function show($id)
    {
        $role = Role::with(['permissions', 'users:id,name,email,profile_picture'])->findOrFail($id);
        $permissions = Permission::all();
        $groupedPermissions = $this->groupPermissions($permissions);

        return Inertia::render('Admin/Roles/Show/RoleShowPage', [
            'role' => $role,
            'rolePermissions' => $role->permissions->pluck('name'),
            'permissions' => $groupedPermissions,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $permissions = Permission::all();
        $groupedPermissions = $this->groupPermissions($permissions);

        return Inertia::render('Admin/Roles/Create/RoleCreatePage', [
            'permissions' => $groupedPermissions,
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web'
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        $permissions = Permission::all();
        $groupedPermissions = $this->groupPermissions($permissions);

        return Inertia::render('Admin/Roles/Edit/RoleEditPage', [
            'role' => $role,
            'rolePermissions' => $role->permissions->pluck('name'),
            'permissions' => $groupedPermissions,
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        // Prevent modification of the Super Admin role name (security practice)
        if ($role->name === 'Super Admin') {
            $role->syncPermissions($request->permissions);
            return redirect()->route('admin.roles.index')->with('success', 'Super Admin permissions updated successfully.');
        }

        $role->update([
            'name' => $request->name,
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        if ($role->name === 'Super Admin') {
            return redirect()->back()->with('error', 'Super Admin role cannot be deleted.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully.');
    }

    /**
     * Remove multiple specified roles.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
        ]);

        // Prevent deleting Super Admin
        $roles = Role::whereIn('id', $request->ids)->where('name', '!=', 'Super Admin')->get();
        foreach ($roles as $role) {
            $role->delete();
        }

        return redirect()->back()->with('success', 'Selected roles deleted successfully.');
    }

    /**
     * Store a dynamically created permission from the admin dashboard (supports multiple comma-separated permissions).
     */
    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:500',
        ]);

        $rawNames = explode(',', $request->name);
        $createdCount = 0;
        $createdNames = [];

        foreach ($rawNames as $rawName) {
            $trimmedName = trim($rawName);
            if (empty($trimmedName)) continue;

            // Clean permission name (e.g. "View Reports" -> "view-reports")
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $trimmedName)));

            // Check if already exists to avoid duplicates error
            if (!Permission::where('name', $slug)->exists()) {
                Permission::create([
                    'name' => $slug,
                    'guard_name' => 'web'
                ]);
                $createdNames[] = $slug;
                $createdCount++;
            }
        }

        if ($createdCount === 0) {
            return redirect()->back()->with('error', 'No new permissions were created (they may already exist).');
        }

        $msg = $createdCount > 1 
            ? $createdCount . ' permissions (' . implode(', ', $createdNames) . ') created successfully.' 
            : 'Permission "' . $createdNames[0] . '" created successfully.';

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Group permissions dynamically by their module suffix
     */
    private function groupPermissions($permissions)
    {
        $grouped = [];
        foreach ($permissions as $permission) {
            $parts = explode('-', $permission->name);
            $module = count($parts) > 1 ? $parts[1] : 'general';
            
            // Clean module name for display
            $moduleName = ucfirst($module);

            $grouped[$moduleName][] = [
                'id' => $permission->id,
                'name' => $permission->name,
                'display_name' => str_replace('-', ' ', ucfirst($permission->name)),
            ];
        }
        return $grouped;
    }
}
