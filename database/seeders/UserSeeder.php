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
        // Define users with roles
        $usersData = [
            // Super Admin
            [
                'email' => 'admin@getitmoving.com',
                'name' => 'Admin User',
                'password' => 'admin123',
                'user_type' => 'admin',
                'phone' => '01700000000',
                'role' => 'Super Admin',
            ],
            // Inventory Managers (3)
            [
                'email' => 'manager.rahim@getitmoving.com',
                'name' => 'Rahim Uddin',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01711111111',
                'role' => 'Inventory Manager',
            ],
            [
                'email' => 'manager.sharmin@getitmoving.com',
                'name' => 'Sharmin Akter',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01711111112',
                'role' => 'Inventory Manager',
            ],
            [
                'email' => 'manager.kabir@getitmoving.com',
                'name' => 'Kabir Hossain',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01711111113',
                'role' => 'Inventory Manager',
            ],
            // Sales Agents (4)
            [
                'email' => 'sales.babul@getitmoving.com',
                'name' => 'Babul Islam',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01722222221',
                'role' => 'Sales Agent',
            ],
            [
                'email' => 'sales.nadia@getitmoving.com',
                'name' => 'Nadia Sultana',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01722222222',
                'role' => 'Sales Agent',
            ],
            [
                'email' => 'sales.arif@getitmoving.com',
                'name' => 'Arif Chowdhury',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01722222223',
                'role' => 'Sales Agent',
            ],
            [
                'email' => 'sales.mehnaz@getitmoving.com',
                'name' => 'Mehnaz Parveen',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01722222224',
                'role' => 'Sales Agent',
            ],
            // Marketing Specialists (3)
            [
                'email' => 'marketing.tanvir@getitmoving.com',
                'name' => 'Tanvir Ahmed',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01733333331',
                'role' => 'Marketing Specialist',
            ],
            [
                'email' => 'marketing.farhana@getitmoving.com',
                'name' => 'Farhana Yasmin',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01733333332',
                'role' => 'Marketing Specialist',
            ],
            [
                'email' => 'marketing.sajal@getitmoving.com',
                'name' => 'Sajal Khan',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01733333333',
                'role' => 'Marketing Specialist',
            ],
            // Customer Supports (4)
            [
                'email' => 'support.roky@getitmoving.com',
                'name' => 'Roky Hasan',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01744444441',
                'role' => 'Customer Support',
            ],
            [
                'email' => 'support.lubna@getitmoving.com',
                'name' => 'Lubna Maria',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01744444442',
                'role' => 'Customer Support',
            ],
            [
                'email' => 'support.zamil@getitmoving.com',
                'name' => 'Zamil Ahmed',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01744444443',
                'role' => 'Customer Support',
            ],
            [
                'email' => 'support.tania@getitmoving.com',
                'name' => 'Tania Noor',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01744444444',
                'role' => 'Customer Support',
            ],
            // Technicians (5)
            [
                'email' => 'tech.milon@getitmoving.com',
                'name' => 'Milon Miah',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01755555551',
                'role' => 'Technician',
            ],
            [
                'email' => 'tech.sayed@getitmoving.com',
                'name' => 'Sayed Ali',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01755555552',
                'role' => 'Technician',
            ],
            [
                'email' => 'tech.reza@getitmoving.com',
                'name' => 'Rezaul Karim',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01755555553',
                'role' => 'Technician',
            ],
            [
                'email' => 'tech.fatema@getitmoving.com',
                'name' => 'Fatema Johura',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01755555554',
                'role' => 'Technician',
            ],
            [
                'email' => 'tech.imran@getitmoving.com',
                'name' => 'Imran Khan',
                'password' => 'password',
                'user_type' => 'admin',
                'phone' => '01755555555',
                'role' => 'Technician',
            ],
        ];

        // Create the Seeded Users and Assign Roles
        foreach ($usersData as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make($data['password']),
                    'user_type' => $data['user_type'],
                    'phone' => $data['phone'],
                    'company_name' => 'Gaget',
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
        $demoUser = User::updateOrCreate(
            ['email' => 'mamon193p@gmail.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('user123'),
                'user_type' => 'user',
                'phone' => '01800000000',
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ]
        );

        // Add Demo Address
        $demoUser->addresses()->updateOrCreate(
            ['type' => 'Home'],
            [
                'user_id' => $demoUser->id,
                'name' => 'Demo User',
                'address' => '123 Tech Avenue, Sector 7',
                'city' => 'Dhaka',
                'area' => 'Uttara',
                'post_code' => '1230',
                'is_primary' => true,
            ]
        );
    }
}
