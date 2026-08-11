<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StudyMaterial;
use App\Models\Course;
use App\Models\Batch;
use App\Models\Subject;
use App\Models\ActivityLog;

class StudyMaterialController extends Controller
{
    public function index()
    {
        $materials = StudyMaterial::with(['course', 'batch', 'subject', 'uploader'])->latest()->get();
        $courses = Course::where('status', 'active')->get();
        $batches = Batch::where('status', 'active')->get();
        $subjects = Subject::all();

        return Inertia::render('Admin/StudyMaterials/Index', [
            'materials' => $materials,
            'courses' => $courses,
            'batches' => $batches,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'course_id' => 'nullable|exists:courses,id',
            'batch_id' => 'nullable|exists:batches,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'file_type' => 'required|string', // PDF, Note, Document, Image, Video, Link
            'link_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $material = StudyMaterial::create([
            ...$validated,
            'uploaded_by' => auth()->id(),
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Material Uploaded',
            'module' => 'Study Materials',
            'description' => "Uploaded study material {$material->title}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Study material added successfully.');
    }

    public function destroy($id)
    {
        $material = StudyMaterial::findOrFail($id);
        $material->delete();

        return redirect()->back()->with('success', 'Study material deleted.');
    }
}
