<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::where('email', 'admin@coaching.com')->first();
if (!$admin) {
    $admin = User::create([
        'name' => 'Super Admin',
        'email' => 'admin@coaching.com',
        'password' => Hash::make('password'),
        'user_type' => 'super_admin',
        'status' => 'active'
    ]);
    echo "CREATED_NEW_ADMIN\n";
} else {
    $admin->password = Hash::make('password');
    $admin->status = 'active';
    $admin->save();
    echo "UPDATED_EXISTING_ADMIN\n";
}

echo "Email: admin@coaching.com\n";
echo "Password: password\n";
echo "UserType: " . $admin->user_type . "\n";
