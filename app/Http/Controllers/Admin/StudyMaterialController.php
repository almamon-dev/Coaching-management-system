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
            'file_type' => 'nullable|string',
            'file' => 'nullable|file|max:512000', // Max 500MB (PDF, ZIP, Video, Doc, etc.)
            'link_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalExt = strtolower($file->getClientOriginalExtension());
            $stored = $file->store('study_materials', 'public');
            $filePath = '/storage/' . $stored;

            // Auto-detect file_type
            if (in_array($originalExt, ['pdf'])) {
                $validated['file_type'] = 'PDF';
            } elseif (in_array($originalExt, ['zip', 'rar', '7z', 'tar', 'gz'])) {
                $validated['file_type'] = 'ZIP';
            } elseif (in_array($originalExt, ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'webm', 'flv'])) {
                $validated['file_type'] = 'Video';
            } elseif (in_array($originalExt, ['mp3', 'wav', 'ogg', 'm4a', 'aac'])) {
                $validated['file_type'] = 'Audio';
            } elseif (in_array($originalExt, ['doc', 'docx', 'odt', 'txt', 'rtf', 'csv', 'xls', 'xlsx'])) {
                $validated['file_type'] = 'Document';
            } elseif (in_array($originalExt, ['ppt', 'pptx'])) {
                $validated['file_type'] = 'Note';
            } elseif (in_array($originalExt, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])) {
                $validated['file_type'] = 'Image';
            } else {
                $validated['file_type'] = strtoupper($originalExt ?: 'File');
            }

            if (empty($validated['link_url'])) {
                $validated['link_url'] = $filePath;
            }
        } else {
            if (empty($validated['file_type'])) {
                $link = strtolower($validated['link_url'] ?? '');
                if (str_contains($link, 'youtube') || str_contains($link, 'youtu.be') || str_contains($link, 'vimeo')) {
                    $validated['file_type'] = 'Video';
                } else {
                    $validated['file_type'] = 'Link';
                }
            }
        }

        // Auto-link Course and Subject from Batch if not explicitly given
        if (!empty($validated['batch_id']) && empty($validated['course_id'])) {
            $batchObj = Batch::find($validated['batch_id']);
            if ($batchObj) {
                $validated['course_id'] = $batchObj->course_id;
                $validated['subject_id'] = $validated['subject_id'] ?? $batchObj->subject_id;
            }
        }

        $material = StudyMaterial::create([
            'title' => $validated['title'],
            'course_id' => $validated['course_id'] ?? null,
            'batch_id' => $validated['batch_id'] ?? null,
            'subject_id' => $validated['subject_id'] ?? null,
            'file_path' => $filePath,
            'file_type' => $validated['file_type'] ?? 'File',
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
