<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicResource;
use App\Models\AcademicClass;
use App\Support\Media\FileUploader;
use App\Support\Media\FileRemover;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicResourceController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicResource::with('academicClass');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $resources = $query->latest()->paginate(15)->withQueryString();
        $classes = AcademicClass::select('id', 'name')->get();

        return Inertia::render('Admin/AcademicResources/Index', [
            'resources' => $resources,
            'classes' => $classes,
            'filters' => $request->only(['type', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:routine,calendar,syllabus,other',
            'academic_class_id' => 'nullable|exists:academic_classes,id',
            'year' => 'nullable|string|max:4',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('file')) {
            $validated['file_path'] = FileUploader::upload('academic_resources', $request->file('file'));
        }

        AcademicResource::create($validated);

        return redirect()->back()->with('success', 'Resource uploaded successfully.');
    }

    public function destroy(AcademicResource $academicResource)
    {
        if ($academicResource->file_path) {
            FileRemover::remove($academicResource->file_path);
        }
        
        $academicResource->delete();

        return redirect()->back()->with('success', 'Resource deleted successfully.');
    }
}
