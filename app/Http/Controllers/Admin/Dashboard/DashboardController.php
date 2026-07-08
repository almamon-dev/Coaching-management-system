<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {

        $usersCount = User::count();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'users' => $usersCount,
                'students' => User::where('user_type', 'user')->count(),
                'staff' => User::where('user_type', 'admin')->count(),
            ],
            'recentActivities' => [],
        ]);
    }
}
