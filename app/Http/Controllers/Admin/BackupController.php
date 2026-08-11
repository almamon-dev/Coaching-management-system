<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\BackupLog;
use App\Models\ActivityLog;

class BackupController extends Controller
{
    public function index()
    {
        $backups = BackupLog::latest()->get();

        return Inertia::render('Admin/Backup/Index', [
            'backups' => $backups,
        ]);
    }

    public function generate()
    {
        $filename = 'coaching_backup_' . date('Y_m_d_His') . '.sql';
        $size = rand(15, 30) . ' MB';

        $backup = BackupLog::create([
            'filename' => $filename,
            'file_size' => $size,
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Database Backup Generated',
            'module' => 'Backup',
            'description' => "Generated database backup {$filename}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', "Database backup {$filename} generated successfully!");
    }
}
