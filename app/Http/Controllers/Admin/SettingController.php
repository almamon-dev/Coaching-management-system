<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\ActivityLog;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'center_name' => 'required|string|max:255',
            'center_tagline' => 'nullable|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'address' => 'required|string',
            'currency_symbol' => 'required|string|max:10',
            'academic_year' => 'required|string|max:20',
            'receipt_footer_note' => 'nullable|string',
            'coaching_mode' => 'nullable|in:single,multi',
        ]);

        foreach ($validated as $key => $value) {
            if ($value !== null) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Settings Updated',
            'module' => 'Settings',
            'description' => "Updated center branding and system configuration settings.",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Coaching center settings updated successfully.');
    }

    public function toggleMode(Request $request)
    {
        $currentMode = Setting::where('key', 'coaching_mode')->value('value') ?? 'single';
        $newMode = $request->input('mode', $currentMode === 'single' ? 'multi' : 'single');

        if (!in_array($newMode, ['single', 'multi'])) {
            $newMode = 'single';
        }

        Setting::updateOrCreate(['key' => 'coaching_mode'], ['value' => $newMode]);

        $modeLabel = $newMode === 'single' ? 'Single Teacher Mode' : 'Multi-Teacher Mode';

        return redirect()->back()->with('success', "Switched to {$modeLabel}.");
    }
}
