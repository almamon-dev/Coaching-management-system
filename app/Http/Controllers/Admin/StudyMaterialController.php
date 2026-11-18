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
        $batches = Course::where('status', 'active')->get();
        $batches = Batch::where('status', 'active')->get();
        $subjects = Subject::all();

        return Inertia::render('Admin/StudyMaterials/Index', [
            'materials' => $materials,
            'batches' => $batches,
            'batches' => $batches,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'course_id' => 'nullable|exists:batches,id',
            'batch_id' => 'nullable|exists:batches,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'file_type' => 'nullable|string', // PDF, Note, Document, Image, Video, Link
            'file' => 'nullable|file|max:51200', // Max 50MB
            'link_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalExt = strtolower($file->getClientOriginalExtension());
            $stored = $file->store('study_materials', 'public');
            $filePath = '/storage/' . $stored;

            // Auto-detect file_type if not manually selected
            if (empty($validated['file_type']) || $validated['file_type'] === 'PDF') {
                if (in_array($originalExt, ['pdf'])) {
                    $validated['file_type'] = 'PDF';
                } elseif (in_array($originalExt, ['doc', 'docx', 'odt', 'txt'])) {
                    $validated['file_type'] = 'Document';
                } elseif (in_array($originalExt, ['ppt', 'pptx'])) {
                    $validated['file_type'] = 'Note';
                } elseif (in_array($originalExt, ['jpg', 'jpeg', 'png', 'webp'])) {
                    $validated['file_type'] = 'Image';
                } else {
                    $validated['file_type'] = strtoupper($originalExt ?: 'File');
                }
            }

            if (empty($validated['link_url'])) {
                $validated['link_url'] = $filePath;
            }
        } else {
            if (empty($validated['file_type'])) {
                $validated['file_type'] = 'Link';
            }
        }

        $material = StudyMaterial::create([
            'title' => $validated['title'],
            'course_id' => $validated['course_id'] ?? null,
            'batch_id' => $validated['batch_id'] ?? null,
            'subject_id' => $validated['subject_id'] ?? null,
            'file_path' => $filePath,
            'file_type' => $validated['file_type'],
            'link_url' => $validated['link_url'] ?? $filePath,
            'description' => $validated['description'] ?? null,
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

        return redirect()->back()->with('success', 'Study material uploaded successfully.');
    }

    public function destroy($id)
    {
        $material = StudyMaterial::findOrFail($id);

        if ($material->file_path && str_starts_with($material->file_path, '/storage/')) {
            $diskPath = str_replace('/storage/', '', $material->file_path);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($diskPath);
        }

        $material->delete();

        return redirect()->back()->with('success', 'Study material deleted.');
    }
}
