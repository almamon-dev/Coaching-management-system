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

        // 2. Define permissions grouped by modules for School Management System
        $permissionsByModule = [
            'academic' => [
                'view-academic',
                'create-academic',
                'edit-academic',
                'delete-academic',
            ],
            'students' => [
                'view-students',
                'create-students',
                'edit-students',
                'delete-students',
                'promote-students',
            ],
            'teachers' => [
                'view-teachers',
                'create-teachers',
                'edit-teachers',
                'delete-teachers',
            ],
            'attendance' => [
                'view-attendance',
                'mark-attendance',
                'edit-attendance',
            ],
            'examinations' => [
                'view-examinations',
                'create-examinations',
                'edit-examinations',
                'delete-examinations',
                'manage-marks',
                'publish-results',
            ],
            'fees' => [
                'view-fees',
                'create-fees',
                'edit-fees',
                'delete-fees',
                'collect-fees',
            ],
            'notices' => [
                'view-notices',
                'create-notices',
                'edit-notices',
                'delete-notices',
            ],
            'events' => [
                'view-events',
                'create-events',
                'edit-events',
                'delete-events',
                'approve-events',
            ],
            'library' => [
                'view-library',
                'manage-library',
            ],
            'reports' => [
                'view-reports',
                'export-reports',
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

        // C. Teacher
        $teacherRole = Role::findOrCreate('teacher', 'web');
        $teacherRole->givePermissionTo([]);

        
        // D. Accountant
        $accountantRole = Role::findOrCreate('Accountant', 'web');
        $accountantRole->givePermissionTo([
            'view-fees',
            'create-fees',
            'edit-fees',
            'delete-fees',
            'collect-fees',
            'view-reports',
            'export-reports'
        ]);
        
        // 5. Assign the Super Admin role to the default admin user
        $adminUser = User::where('email', 'admin@school.com')->first();
        if ($adminUser) {
            $adminUser->assignRole($superAdminRole);
        }
    }
}
