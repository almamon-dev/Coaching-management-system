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
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'hero_banner_image' => 'nullable',
            'stat_students' => 'nullable|string|max:50',
            'stat_teachers' => 'nullable|string|max:50',
            'stat_courses' => 'nullable|string|max:50',
            'stat_success' => 'nullable|string|max:50',
            'about_title' => 'nullable|string|max:255',
            'about_description' => 'nullable|string',
            'about_image' => 'nullable',
            // Admission Instructions CMS
            'admission_title' => 'nullable|string|max:255',
            'admission_subtitle' => 'nullable|string',
            'admission_alert_title' => 'nullable|string|max:255',
            'admission_alert_text' => 'nullable|string',
            'admission_alert_enabled' => 'nullable|string|max:10',
            'admission_step1_title' => 'nullable|string|max:255',
            'admission_step1_desc' => 'nullable|string',
            'admission_step2_title' => 'nullable|string|max:255',
            'admission_step2_desc' => 'nullable|string',
            'admission_documents' => 'nullable|string',
            'admission_step3_title' => 'nullable|string|max:255',
            'admission_step3_desc' => 'nullable|string',
            'admission_office_hours' => 'nullable|string',
            'admission_phone' => 'nullable|string|max:100',
            'admission_email' => 'nullable|string|max:100',
            'admission_location' => 'nullable|string',
        ]);

        if ($request->hasFile('hero_banner_image')) {
            $path = $request->file('hero_banner_image')->store('cms', 'public');
            Setting::updateOrCreate(['key' => 'hero_banner_image'], ['value' => '/storage/' . $path]);
            unset($validated['hero_banner_image']);
        }

        if ($request->hasFile('about_image')) {
            $path = $request->file('about_image')->store('cms', 'public');
            Setting::updateOrCreate(['key' => 'about_image'], ['value' => '/storage/' . $path]);
            unset($validated['about_image']);
        }

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

    public function landingCms()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/CMS/LandingPage', [
            'settings' => $settings,
        ]);
    }

    public function updateLandingCms(Request $request)
    {
        $validated = $request->validate([
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'hero_banner_image' => 'nullable',
            'stat_students' => 'nullable|string|max:50',
            'stat_teachers' => 'nullable|string|max:50',
            'stat_courses' => 'nullable|string|max:50',
            'stat_success' => 'nullable|string|max:50',
        ]);

        if ($request->hasFile('hero_banner_image')) {
            $path = $request->file('hero_banner_image')->store('cms', 'public');
            Setting::updateOrCreate(['key' => 'hero_banner_image'], ['value' => '/storage/' . $path]);
            unset($validated['hero_banner_image']);
        }

        foreach ($validated as $key => $value) {
            if ($value !== null) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return redirect()->back()->with('success', 'Landing page content updated successfully.');
    }

    public function admissionCms()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/CMS/AdmissionPage', [
            'settings' => $settings,
        ]);
    }

    public function updateAdmissionCms(Request $request)
    {
        $validated = $request->validate([
            'admission_title' => 'nullable|string|max:255',
            'admission_subtitle' => 'nullable|string',
            'admission_alert_title' => 'nullable|string|max:255',
            'admission_alert_text' => 'nullable|string',
            'admission_alert_enabled' => 'nullable|string|max:10',
            'admission_step1_title' => 'nullable|string|max:255',
            'admission_step1_desc' => 'nullable|string',
            'admission_step2_title' => 'nullable|string|max:255',
            'admission_step2_desc' => 'nullable|string',
            'admission_documents' => 'nullable|string',
            'admission_step3_title' => 'nullable|string|max:255',
            'admission_step3_desc' => 'nullable|string',
            'admission_office_hours' => 'nullable|string',
            'admission_phone' => 'nullable|string|max:100',
            'admission_email' => 'nullable|string|max:100',
            'admission_location' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            if ($value !== null) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return redirect()->back()->with('success', 'Admission instructions updated successfully.');
    }

    public function aboutCms()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/CMS/AboutPage', [
            'settings' => $settings,
        ]);
    }

    public function updateAboutCms(Request $request)
    {
        $validated = $request->validate([
            'about_header_title' => 'nullable|string|max:255',
            'about_header_subtitle' => 'nullable|string',
            'about_title' => 'nullable|string|max:255',
            'about_text' => 'nullable|string',
            'about_mission_title' => 'nullable|string|max:255',
            'about_mission_text' => 'nullable|string',
            'about_vision_title' => 'nullable|string|max:255',
            'about_vision_text' => 'nullable|string',
            'about_stat_heritage' => 'nullable|string|max:50',
            'about_stat_success' => 'nullable|string|max:50',
            'about_stat_students' => 'nullable|string|max:50',
            'about_image' => 'nullable',
        ]);

        if ($request->hasFile('about_image')) {
            $path = $request->file('about_image')->store('cms', 'public');
            Setting::updateOrCreate(['key' => 'about_image'], ['value' => '/storage/' . $path]);
            unset($validated['about_image']);
        }

        foreach ($validated as $key => $value) {
            if ($value !== null) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return redirect()->back()->with('success', 'About Us page settings updated successfully.');
    }
}
