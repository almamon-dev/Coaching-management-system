<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicInquiry;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicInquiryController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = AcademicInquiry::query();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('batch_or_course', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'all' => AcademicInquiry::count(),
            'pending' => AcademicInquiry::where('status', 'pending')->count(),
            'contacted' => AcademicInquiry::where('status', 'contacted')->count(),
            'enrolled' => AcademicInquiry::where('status', 'enrolled')->count(),
            'closed' => AcademicInquiry::where('status', 'closed')->count(),
        ];

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'stats' => $stats,
        ]);
    }

    public function update(Request $request, $id)
    {
        $inquiry = AcademicInquiry::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,enrolled,closed',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $inquiry->update($validated);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()?->name ?? 'Admin',
            'user_role' => auth()->user()?->user_type ?? 'admin',
            'action' => 'Inquiry Updated',
            'module' => 'Academic Inquiries',
            'description' => "Updated inquiry #{$inquiry->id} ({$inquiry->name}) status to {$inquiry->status}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Inquiry status updated successfully.');
    }

    public function destroy(Request $request, $id)
    {
        $inquiry = AcademicInquiry::findOrFail($id);
        $name = $inquiry->name;
        $inquiry->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()?->name ?? 'Admin',
            'user_role' => auth()->user()?->user_type ?? 'admin',
            'action' => 'Inquiry Deleted',
            'module' => 'Academic Inquiries',
            'description' => "Deleted inquiry #{$id} from {$name}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Inquiry deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:academic_inquiries,id',
        ]);

        $count = count($validated['ids']);
        AcademicInquiry::whereIn('id', $validated['ids'])->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()?->name ?? 'Admin',
            'user_role' => auth()->user()?->user_type ?? 'admin',
            'action' => 'Bulk Inquiries Deleted',
            'module' => 'Academic Inquiries',
            'description' => "Deleted {$count} academic inquiries",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', "{$count} inquiries deleted successfully.");
    }
}

