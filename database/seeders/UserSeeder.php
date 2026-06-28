<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define school users with roles
        $usersData = [
            // Super Admin
            [
                'email' => 'admin@school.com',
                'name' => 'School Admin',
                'password' => 'admin123',
                'user_type' => 'admin',
                'phone' => '01700000000',
                'role' => 'Super Admin',
            ],
            // Principal
            [
                'email' => 'principal@school.com',
                'name' => 'Principal Sir',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01711111111',
                'role' => 'Principal',
            ],
        ];

        foreach ($usersData as $index => $data) {
            $username = explode('@', $data['email'])[0];
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'username' => $username,
                    'password' => Hash::make($data['password'] ?? 'password'),
                    'user_type' => 'admin',
                    'phone' => $data['phone'],
                    'company_name' => 'School Name',
                    'is_verified' => true,
                    'email_verified_at' => now(),
                    'verified_at' => now(),
                    'terms_accepted_at' => now(),
                ]
            );

            // Assign Spatie Role
            $user->assignRole($data['role']);
        }

        // Create Demo Customer User
        User::updateOrCreate(
            ['email' => 'mamon193p@gmail.com'],
            [
                'name' => 'Demo User',
                'username' => 'mamon193p',
                'password' => Hash::make('user123'),
                'user_type' => 'user',
                'phone' => '01800000000',
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ]
        );
    }
}
