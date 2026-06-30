<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Define permissions grouped by modules
        $permissionsByModule = [
            'products' => [
                'view-products',
                'create-products',
                'edit-products',
                'delete-products',
            ],
            'categories' => [
                'view-categories',
                'create-categories',
                'edit-categories',
                'delete-categories',
            ],
            'brands' => [
                'view-brands',
                'create-brands',
                'edit-brands',
                'delete-brands',
            ],
            'orders' => [
                'view-orders',
                'edit-orders',
                'process-orders',
                'delete-orders',
            ],
            'suppliers' => [
                'view-suppliers',
                'create-suppliers',
                'edit-suppliers',
                'delete-suppliers',
            ],
            'warehouses' => [
                'view-warehouses',
                'create-warehouses',
                'edit-warehouses',
                'delete-warehouses',
            ],
            'reviews' => [
                'view-reviews',
                'edit-reviews',
                'delete-reviews',
            ],
            'questions' => [
                'view-questions',
                'reply-questions',
                'delete-questions',
            ],
            'marketing' => [
                'view-marketing',
                'create-marketing',
                'edit-marketing',
                'delete-marketing',
            ],
            'settings' => [
                'view-settings',
                'edit-settings',
            ],
            'users' => [
                'view-users',
                'create-users',
                'edit-users',
                'delete-users',
            ],
            'roles' => [
                'view-roles',
                'create-roles',
                'edit-roles',
                'delete-roles',
            ],
            'repairs' => [
                'view-repairs',
                'edit-repairs',
                'diagnose-repairs',
            ],
        ];

        // 3. Create all permissions in the database
        foreach ($permissionsByModule as $module => $permissions) {
            foreach ($permissions as $permissionName) {
                Permission::findOrCreate($permissionName, 'web');
            }
        }

        // 4. Create Roles and Assign Permissions

        // A. Super Admin: full access
        $superAdminRole = Role::findOrCreate('Super Admin', 'web');
        $superAdminRole->givePermissionTo(Permission::all());

        // B. Principal
        $principalRole = Role::findOrCreate('Principal', 'web');
        // Give some permissions if needed, or all
        $principalRole->givePermissionTo(Permission::all());

        // C. Staff & Teacher
        $staffRole = Role::findOrCreate('staff', 'web');
        $teacherRole = Role::findOrCreate('teacher', 'web');
        
        // 5. Assign the Super Admin role to the default admin user
        $adminUser = User::where('email', 'admin@school.com')->first();
        if ($adminUser) {
            $adminUser->assignRole($superAdminRole);
        }
    }
}
