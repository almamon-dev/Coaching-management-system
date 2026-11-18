<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\RolePermission;
use App\Models\Setting;
use App\Models\ActivityLog;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Reset cached roles & permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Settings Setup (System Branding & Config)
        $settings = [
            'center_name' => 'Ullash Coaching Center',
            'center_tagline' => 'Excellence in Board Exam & College Preparation',
            'center_logo' => '/images/Logo.png',
            'phone' => '+880 1711-223344',
            'email' => 'info@ullashcoaching.com',
            'address' => 'House 42, Road 11, Block E, Banani, Dhaka, Bangladesh',
            'currency_symbol' => '৳',
            'academic_year' => '2026',
            'receipt_footer_note' => 'Thank you for choosing Ullash Coaching Center. Keep this receipt for future reference.',
            'success_stat_pass_rate' => '98.4%',
            'success_stat_pass_label' => 'Board Exam Pass Rate',
            'success_stat_gpa5' => '1,250+',
            'success_stat_gpa5_label' => 'GPA 5.00 Achievers',
            'success_stat_admissions' => '500+',
            'success_stat_admissions_label' => 'University Admissions',
            'success_stat_experience' => '15+',
            'success_stat_experience_label' => 'Years of Excellence',
            'facebook_url' => 'https://facebook.com/ullashcoaching',
            'youtube_url' => 'https://youtube.com/@ullashcoaching',
            'instagram_url' => 'https://instagram.com/ullashcoaching',
            'linkedin_url' => 'https://linkedin.com/company/ullashcoaching',
            'whatsapp_number' => '+8801712345678',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // 3. Module Permissions Matrix
        $modules = [
            'dashboard', 'students', 'admissions', 'teachers', 'batches',
            'routines', 'attendance', 'fees', 'receipts', 'expenses', 'incomes',
            'exams', 'results', 'assignments', 'materials', 'notices', 'reports',
            'permissions', 'logs', 'settings', 'backup'
        ];

        RolePermission::updateOrCreate(
            ['role' => 'super_admin'],
            ['permissions' => $modules]
        );

        RolePermission::updateOrCreate(
            ['role' => 'manager'],
            ['permissions' => array_diff($modules, ['permissions', 'backup'])]
        );

        RolePermission::updateOrCreate(
            ['role' => 'teacher'],
            ['permissions' => ['dashboard', 'routines', 'attendance', 'exams', 'results', 'assignments', 'materials', 'notices']]
        );

        RolePermission::updateOrCreate(
            ['role' => 'accountant'],
            ['permissions' => ['dashboard', 'students', 'admissions', 'fees', 'receipts', 'expenses', 'incomes', 'reports']]
        );

        RolePermission::updateOrCreate(
            ['role' => 'student'],
            ['permissions' => ['dashboard', 'routines', 'attendance', 'fees', 'exams', 'results', 'assignments', 'materials', 'notices']]
        );

        RolePermission::updateOrCreate(
            ['role' => 'guardian'],
            ['permissions' => ['dashboard', 'routines', 'attendance', 'fees', 'exams', 'results', 'assignments', 'notices']]
        );

        // 4. Spatie Roles & Permissions
        $this->call(RoleAndPermissionSeeder::class);
        $superAdminRole = Role::findOrCreate('Super Admin', 'web');

        // 5. Super Admin User (Single Master Account)
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@coaching.com'],
            [
                'name' => 'Super Admin',
                'user_type' => 'super_admin',
                'status' => 'active',
                'phone' => '+8801700000001',
                'password' => Hash::make('password'),
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ]
        );

        // Assign Spatie Super Admin role
        if (!$adminUser->hasRole('Super Admin')) {
            $adminUser->assignRole($superAdminRole);
        }

        // 6. Initial Activity Log
        ActivityLog::create([
            'user_id' => $adminUser->id,
            'user_name' => 'Super Admin',
            'user_role' => 'super_admin',
            'action' => 'System Initialized',
            'module' => 'System',
            'description' => 'System initialized with single Super Admin account. All dummy user and student data removed for manual testing.',
            'ip_address' => '127.0.0.1',
        ]);
    }
}
