<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HarassmentComplaint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HarassmentComplaintController extends Controller
{
    public function index()
    {
        $complaints = HarassmentComplaint::latest()->paginate(15);
        return Inertia::render('Admin/HarassmentComplaint/Index', [
            'complaints' => $complaints
        ]);
    }

    public function show(HarassmentComplaint $harassment_complaint)
    {
        return Inertia::render('Admin/HarassmentComplaint/Show', [
            'complaint' => $harassment_complaint
        ]);
    }

    public function updateStatus(Request $request, HarassmentComplaint $harassment_complaint)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,investigating,resolved'
        ]);

        $harassment_complaint->update(['status' => $validated['status']]);

        return back()->with('success', 'Complaint status updated successfully.');
    }

    public function destroy(HarassmentComplaint $harassment_complaint)
    {
        $harassment_complaint->delete();
        return redirect()->route('admin.harassment-complaints.index')->with('success', 'Complaint deleted successfully.');
    }
}
