<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\HarassmentComplaint;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Support\Media\FileUploader;

class HarassmentComplaintController extends Controller
{
    public function create()
    {
        return Inertia::render('Frontend/HarassmentComplaint/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|max:50',
            'description' => 'required|string',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:5120', // Max 5MB
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = FileUploader::upload('complaints', $request->file('attachment'));
        }

        HarassmentComplaint::create($validated);

        return redirect()->back()->with('success', 'Your complaint has been submitted successfully and securely.');
    }
}
