<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Notice;
use App\Models\Course;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\Testimonial;
use App\Models\ImportantLink;
use App\Models\Setting;
use App\Models\Batch;
use App\Models\StudyMaterial;
use App\Models\AcademicInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        // 1. Dynamic Notices from Database
        $dbNotices = Notice::latest()->take(20)->get()->map(function($notice) {
            $dateObj = $notice->published_at ? new \DateTime((string)$notice->published_at) : new \DateTime((string)$notice->created_at);
            return [
                'id' => $notice->id,
                'day' => $dateObj->format('d'),
                'month' => strtoupper($dateObj->format('M')),
                'title' => $notice->title,
                'description' => Str::limit(strip_tags((string)$notice->content), 140),
                'content' => $notice->content,
                'category' => $notice->category ?? 'General',
                'priority' => $notice->priority ?? 'normal',
                'target_role' => $notice->target_role ?? 'All',
                'isNew' => $notice->priority === 'high' || $dateObj > new \DateTime('-7 days'),
                'date_formatted' => $dateObj->format('d M, Y'),
            ];
        });

        // 2. Dynamic Important Links
        $dbImportantLinks = ImportantLink::where('is_active', true)->orderBy('order', 'asc')->get()->map(function($link) {
            return [
                'title' => $link->title,
                'href' => $link->url,
            ];
        });

        // 3. Dynamic Batches (Coaching Batches)
        $dbBatches = Batch::where('status', 'active')
            ->with(['course.subjects', 'teacher.user'])
            ->withCount('students')
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn($b) => $this->formatBatchData($b));

        // Dynamic batches for reference
        $dbbatches = Course::where('status', 'active')
            ->with(['subjects', 'batches' => function($q) {
                $q->where('status', 'active');
            }])
            ->orderBy('id', 'asc')
            ->get()
            ->map(function($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'code' => $course->code,
                    'category' => $course->category ?? 'Academic Program',
                    'fee' => (float)$course->fee,
                    'admission_fee' => (float)$course->admission_fee,
                    'duration' => $course->duration ?? '12 Months',
                    'total_lectures' => $course->total_lectures ?: ($course->subjects ? $course->subjects->sum('total_lectures') : 0),
                    'total_lessons' => $course->total_lessons ?: ($course->subjects ? $course->subjects->sum('total_lessons') : 0),
                    'description' => $course->description,
                    'syllabus_details' => $course->syllabus_details,
                    'subjects' => $course->subjects ? $course->subjects->map(function($sub) {
                        return [
                            'id' => $sub->id,
                            'name' => $sub->name,
                            'code' => $sub->code,
                            'lectures' => $sub->total_lectures,
                            'lessons' => $sub->total_lessons,
                            'description' => $sub->description,
                        ];
                    })->values()->toArray() : [],
                    'batches' => $course->batches ? $course->batches->map(function($b) {
                        return [
                            'id' => $b->id,
                            'name' => $b->name,
                            'class_days' => $b->class_days,
                            'class_time' => $b->class_time,
                            'room' => $b->room,
                            'max_students' => $b->max_students,
                        ];
                    })->values()->toArray() : [],
                    'link' => route('admissions'),
                ];
            });

        // 4. Dynamic Upcoming Events
        $dbEvents = Event::where('status', 'published')->orderBy('date', 'asc')->take(4)->get()->map(function($evt) {
            $dateObj = new \DateTime((string)$evt->date);
            return [
                'id' => $evt->id,
                'title' => $evt->title,
                'image' => $evt->image ?? '/images/ullash_award_crest_01.jpg',
                'month' => strtoupper($dateObj->format('M')),
                'day' => $dateObj->format('d'),
                'time' => $evt->time ?? '10:00 AM',
                'location' => $evt->location ?? 'Campus Auditorium',
                'description' => $evt->description,
                'color' => $evt->color ?? 'emerald',
            ];
        });

        // 5. Dynamic Gallery Photos (Bento Grid)
        $dbGalleries = Gallery::where('status', 'published')->orderBy('sort_order', 'asc')->take(4)->get()->map(function($item) {
            $img = $item->image;
            if (!str_starts_with($img, '/') && !str_starts_with($img, 'http')) {
                $img = '/' . $img;
            }
            return [
                'id' => $item->id,
                'title' => $item->title,
                'category' => $item->category,
                'image' => $img,
            ];
        });

        // 6. Dynamic Testimonials (Student Success Stories)
        $dbTestimonials = Testimonial::where('status', 'published')->orderBy('sort_order', 'asc')->take(4)->get();

        return Inertia::render('Frontend/Home', [
            'dbNotices' => $dbNotices,
            'dbImportantLinks' => $dbImportantLinks,
            'dbBatches' => $dbBatches,
            'dbbatches' => $dbbatches,
            'dbEvents' => $dbEvents,
            'dbGalleries' => $dbGalleries,
            'dbTestimonials' => $dbTestimonials,
            'cmsSettings' => $settings,
        ]);
    }

    public function admissions()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Frontend/Admissions', [
            'settings' => $settings,
        ]);
    }

    public function notices()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $notices = Notice::latest()->paginate(10)->through(function($notice) {
            $dateObj = $notice->published_at ? new \DateTime((string)$notice->published_at) : new \DateTime((string)$notice->created_at);
            return [
                'id' => $notice->id,
                'title' => $notice->title,
                'description' => Str::limit(strip_tags((string)$notice->content), 150),
                'content' => $notice->content,
                'category' => $notice->category ?? 'General',
                'priority' => $notice->priority ?? 'normal',
                'author' => 'Administration',
                'date' => $dateObj->format('Y-m-d'),
                'day' => $dateObj->format('d'),
                'month' => strtoupper($dateObj->format('M')),
                'is_new' => $notice->priority === 'high' || $dateObj > new \DateTime('-7 days'),
            ];
        });

        return Inertia::render('Frontend/Notices/Index', [
            'notices' => $notices,
            'settings' => $settings,
        ]);
    }

    public function noticeShow($id)
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $notice = Notice::find($id);

        if (!$notice) {
            return redirect()->route('notices.index');
        }

        $dateObj = $notice->published_at ? new \DateTime((string)$notice->published_at) : new \DateTime((string)$notice->created_at);
        $formattedNotice = [
            'id' => $notice->id,
            'title' => $notice->title,
            'content' => $notice->content,
            'category' => $notice->category ?? 'General',
            'priority' => $notice->priority ?? 'normal',
            'author' => 'Administration',
            'date' => $dateObj->format('Y-m-d'),
            'published_at' => $dateObj->format('d M, Y'),
            'attachment' => null,
        ];

        $recentNotices = Notice::where('id', '!=', $id)->latest()->take(5)->get()->map(function($n) {
            $d = $n->published_at ? new \DateTime((string)$n->published_at) : new \DateTime((string)$n->created_at);
            return [
                'id' => $n->id,
                'title' => $n->title,
                'date' => $d->format('Y-m-d'),
                'day' => $d->format('d'),
                'month' => strtoupper($d->format('M')),
            ];
        });

        return Inertia::render('Frontend/Notices/Show', [
            'notice' => $formattedNotice,
            'recentNotices' => $recentNotices,
            'settings' => $settings,
        ]);
    }

    public function events()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $dbEvents = Event::where('status', 'published')->orderBy('date', 'asc')->get()->map(function($evt) {
            $dateObj = new \DateTime((string)$evt->date);
            return [
                'id' => $evt->id,
                'title' => $evt->title,
                'image' => $evt->image ?? '/images/ullash_award_crest_01.jpg',
                'month' => strtoupper($dateObj->format('M')),
                'day' => $dateObj->format('d'),
                'time' => $evt->time ?? '10:00 AM',
                'location' => $evt->location ?? 'Campus Auditorium',
                'description' => $evt->description,
                'color' => $evt->color ?? 'emerald',
                'category' => $evt->category ?? 'Academic',
            ];
        });

        return Inertia::render('Frontend/Events', [
            'dbEvents' => $dbEvents,
            'settings' => $settings,
        ]);
    }

    public function gallery()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $dbGalleries = Gallery::where('status', 'published')->orderBy('sort_order', 'asc')->get()->map(function($item) {
            $img = $item->image;
            if (!str_starts_with($img, '/') && !str_starts_with($img, 'http')) {
                $img = '/' . $img;
            }
            return [
                'id' => $item->id,
                'title' => $item->title,
                'category' => $item->category,
                'image' => $img,
                'src' => $img,
            ];
        });

        return Inertia::render('Frontend/Gallery', [
            'dbGalleries' => $dbGalleries,
            'settings' => $settings,
        ]);
    }

    public function successStories()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $dbTestimonials = Testimonial::where('status', 'published')->orderBy('sort_order', 'asc')->get();

        return Inertia::render('Frontend/SuccessStories', [
            'dbTestimonials' => $dbTestimonials,
            'settings' => $settings,
        ]);
    }

    public function aboutUs()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Frontend/AboutUs', [
            'settings' => $settings,
        ]);
    }

    public function contact()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Frontend/Contact', [
            'settings' => $settings,
        ]);
    }

    protected function formatBatchData($b)
    {
        $course = $b->course;
        $courseTitle = trim(preg_replace('/([a-zA-Z0-9])\(/', '$1 (', (string)($course?->title ?? '')));
        // Strip any embedded routine/times like (07:00 AM - 08:30 AM) from batch name
        $cleanBatchName = trim(preg_replace('/\s*\(\d{1,2}:\d{2}\s*(?:AM|PM)[\s\S]*?\)/i', '', (string)$b->name));
        $cleanBatchName = trim(preg_replace('/^Batch\s*\d*\s*:\s*/i', '', $cleanBatchName));
        $cleanBatchName = trim($cleanBatchName, " -:,");

        if ($courseTitle) {
            if ($cleanBatchName && stripos($cleanBatchName, $courseTitle) === false && $cleanBatchName !== $courseTitle) {
                $cleanTitle = $courseTitle . ' - ' . $cleanBatchName;
            } else {
                $cleanTitle = $cleanBatchName ?: $courseTitle;
            }
        } else {
            $cleanTitle = $cleanBatchName ?: $b->name;
        }

        if (!str_contains(strtolower($cleanTitle), 'batch')) {
            $cleanTitle .= ' Batch';
        }

        $desc = $course?->description;
        if (!$desc || str_contains($desc, 'Complete academic curriculum')) {
            if (str_contains($cleanTitle, 'Physics')) {
                $desc = 'Complete HSC Physics (1st & 2nd Paper) with a clear concept, problem solving, and exam preparation.';
            } elseif (str_contains($cleanTitle, 'Higher Math')) {
                $desc = 'Complete Higher Mathematics (1st & 2nd Paper) with in-depth concepts, practice, and exam preparation.';
            } elseif (str_contains($cleanTitle, 'Chemistry')) {
                $desc = 'In-depth HSC Chemistry (1st & 2nd Paper) covering Qualitative, Kinetics, Organic & Electrochemistry.';
            } elseif (str_contains($cleanTitle, 'ICT')) {
                $desc = 'Comprehensive HSC ICT syllabus coverage with C Programming, HTML/Web, Database and Networking.';
            } elseif (str_contains($cleanTitle, 'Class 9')) {
                $desc = 'Foundation building for Class 9 Science students with intensive focus on Math, Physics, Chem & ICT.';
            } elseif (str_contains($cleanTitle, 'Class 10') || str_contains($cleanTitle, 'SSC')) {
                $desc = 'Complete SSC board preparation for Science students focusing on test papers, model tests, and CQ mastery.';
            } else {
                $desc = 'Expert-guided coaching program with comprehensive syllabus coverage and exam-focused revision.';
            }
        }

        $totalClasses = $course?->total_lectures ?: ($course?->subjects ? $course->subjects->sum('total_lectures') : 48);
        if ($totalClasses <= 0) {
            $totalClasses = 48;
        }

        $batchImage = $b->image;
        if (!$batchImage) {
            $titleLower = strtolower($cleanTitle);
            if (str_contains($titleLower, 'physics')) {
                $batchImage = '/images/batches/batch_physics.jpg';
            } elseif (str_contains($titleLower, 'higher math') || str_contains($titleLower, 'math')) {
                $batchImage = '/images/batches/batch_higher_math.jpg';
            } elseif (str_contains($titleLower, 'chemistry')) {
                $batchImage = '/images/batches/batch_chemistry.jpg';
            } elseif (str_contains($titleLower, 'ict')) {
                $batchImage = '/images/batches/batch_ict.jpg';
            } elseif (str_contains($titleLower, 'class 9') || str_contains($titleLower, 'cls9')) {
                $batchImage = '/images/batches/batch_class9.jpg';
            } elseif (str_contains($titleLower, 'class 10') || str_contains($titleLower, 'ssc')) {
                $batchImage = '/images/batches/batch_class10.jpg';
            } else {
                $batchImage = '/images/batches/batch_revision.jpg';
            }
        }

        return [
            'id' => $b->id,
            'name' => $b->name,
            'display_title' => $cleanTitle,
            'course_id' => $b->course_id,
            'subject_title' => $course?->title ?? 'Academic Subject',
            'category' => $course?->category ?? 'HSC / Intermediate',
            'code' => $course?->code ?? ('BATCH-' . $b->id),
            'image' => $batchImage,
            'description' => $desc,
            'duration' => $course?->duration ?? '12 Months',
            'total_classes' => $totalClasses,
            'fee' => (float)($course?->fee ?? 1500),
            'admission_fee' => (float)($course?->admission_fee ?? 500),
            'class_days' => $b->class_days ?? 'Regular Days',
            'class_time' => $b->class_time ?? 'Schedule',
            'room' => $b->room ?? 'Main Campus Hall Room',
            'max_students' => (int)($b->max_students ?? 25),
            'enrolled_count' => (int)($b->students_count ?? 0),
            'seats_left' => max(0, (int)($b->max_students ?? 25) - (int)($b->students_count ?? 0)),
            'teacher_name' => $b->teacher?->user?->name ?? $b->teacher?->name ?? 'Specialist Faculty Member',
            'teacher_designation' => $b->teacher?->designation ?? 'Senior Lecturer',
            'teacher_email' => $b->teacher?->user?->email,
            'subjects' => $course?->subjects ? $course->subjects->map(function($sub) {
                return [
                    'id' => $sub->id,
                    'name' => $sub->name,
                    'code' => $sub->code,
                    'lectures' => $sub->total_lectures,
                    'description' => $sub->description,
                ];
            })->values()->toArray() : [],
            'status' => $b->status ?? 'active',
            'link' => route('admissions'),
            'details_url' => route('batches.show', $b->id),
        ];
    }

    public function batchIndex()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        $batches = Batch::where('status', 'active')
            ->with(['course.subjects', 'teacher.user'])
            ->withCount('students')
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn($b) => $this->formatBatchData($b));

        return Inertia::render('Frontend/Batches/Index', [
            'dbBatches' => $batches,
            'settings' => $settings,
        ]);
    }

    public function batchShow($id)
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $batch = Batch::with(['course.subjects', 'teacher.user'])
            ->withCount('students')
            ->find($id);

        if (!$batch) {
            return redirect()->route('batches.index');
        }

        $formattedBatch = $this->formatBatchData($batch);

        $otherBatches = Batch::where('id', '!=', $batch->id)
            ->where('status', 'active')
            ->with(['course.subjects', 'teacher.user'])
            ->take(4)
            ->get()
            ->map(fn($ob) => $this->formatBatchData($ob));

        $studyMaterials = StudyMaterial::with('subject')
            ->where(function($q) use ($batch) {
                $q->where('batch_id', $batch->id)
                  ->orWhere('course_id', $batch->course_id)
                  ->orWhereNull('batch_id');
            })
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Frontend/Batches/Show', [
            'batch' => $formattedBatch,
            'otherBatches' => $otherBatches,
            'studyMaterials' => $studyMaterials,
            'settings' => $settings,
        ]);
    }

    public function storeInquiry(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:25',
            'email' => 'nullable|email|max:100',
            'batch' => 'nullable|string|max:150',
            'message' => 'nullable|string|max:2000',
        ]);

        $inquiryMessage = !empty($validated['message']) 
            ? $validated['message'] 
            : ('Inquiry regarding ' . (!empty($validated['batch']) ? $validated['batch'] : 'Academic Coaching programs'));

        AcademicInquiry::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'batch_or_course' => $validated['batch'] ?? null,
            'message' => $inquiryMessage,
            'status' => 'pending',
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Thank you! Your academic inquiry has been received. Our counseling team will contact you shortly.');
    }
}
