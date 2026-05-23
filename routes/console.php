<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;
Schedule::command('app:release-supplier-funds')->everyMinute();

use App\Models\User;

Artisan::command('app:clean-expired-invitations', function () {
    $deletedCount = User::where('user_type', 'admin')
        ->where('is_verified', false)
        ->whereNull('email_verified_at')
        ->where('created_at', '<', now()->subDays(3))
        ->delete();
        
    $this->info("Deleted {$deletedCount} expired staff invitations.");
})->purpose('Auto-delete staff invitations older than 3 days that have not been accepted');

Schedule::command('app:clean-expired-invitations')->daily();
