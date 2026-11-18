<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'student_id',
        'name',
        'photo',
        'dob',
        'gender',
        'phone',
        'email',
        'address',
        'guardian_name',
        'guardian_phone',
        'guardian_id',
        'school_college',
        'course_id',
        'batch_id',
        'admission_date',
        'status',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get a short code for a batch / subject.
     */
    public static function getBatchShortCode($batch = null, $course = null): string
    {
        $courseObj = $course ?? $batch?->course;
        
        // 1. Try from course code (e.g. HSC-HMATH-101 -> HMATH, CLS10-SCI-201 -> CLS10)
        if ($courseObj && !empty($courseObj->code)) {
            $parts = explode('-', $courseObj->code);
            if (count($parts) >= 2) {
                if (str_starts_with(strtoupper($parts[0]), 'CLS')) {
                    return strtoupper($parts[0]);
                }
                return strtoupper($parts[1]);
            }
            return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $courseObj->code));
        }

        // 2. Try from batch name or course title
        $name = strtolower($batch?->name ?? $courseObj?->title ?? '');
        if (str_contains($name, 'math')) return 'HMATH';
        if (str_contains($name, 'physic') || str_contains($name, 'phy')) return 'PHY';
        if (str_contains($name, 'ict')) return 'ICT';
        if (str_contains($name, 'class 10') || str_contains($name, 'ssc')) return 'CLS10';
        if (str_contains($name, 'class 9')) return 'CLS9';
        if (str_contains($name, 'chem')) return 'CHEM';
        if (str_contains($name, 'bio')) return 'BIO';

        if (!empty($name)) {
            $cleaned = preg_replace('/[^A-Za-z0-9]/', '', strtoupper(substr($name, 0, 5)));
            if (!empty($cleaned)) return $cleaned;
        }

        return 'GEN';
    }

    /**
     * Auto Generate Student ID in format: UCCA-{BATCH_SHORT}-{SERIAL} (e.g. UCCA-HMATH-0001)
     */
    public static function generateStudentId($batch = null, $course = null): string
    {
        $batchCode = static::getBatchShortCode($batch, $course);

        $serial = 1;
        do {
            $candidate = "UCCA-{$batchCode}-" . str_pad($serial, 4, '0', STR_PAD_LEFT);
            if (!static::where('student_id', $candidate)->exists()) {
                return $candidate;
            }
            $serial++;
        } while (true);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function batches()
    {
        return $this->belongsToMany(Batch::class, 'batch_student', 'student_id', 'batch_id')
            ->withPivot(['course_id', 'monthly_fee', 'roll_number', 'status', 'enrolled_at'])
            ->withTimestamps();
    }

    public function enrolledbatches()
    {
        return $this->belongsToMany(Course::class, 'batch_student', 'student_id', 'course_id')
            ->withPivot(['monthly_fee', 'status'])
            ->distinct();
    }

    public function totalMonthlyFee(): float
    {
        $fee = (float) $this->batches()->wherePivot('status', 'active')->sum('batch_student.monthly_fee');
        if ($fee <= 0 && $this->course) {
            return (float) $this->course->fee;
        }
        return $fee;
    }

    public function guardian()
    {
        return $this->belongsTo(GuardianProfile::class, 'guardian_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    public function feeInvoices()
    {
        return $this->hasMany(FeeInvoice::class, 'student_id');
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class, 'student_id');
    }

    public function marks()
    {
        return $this->hasMany(Mark::class, 'student_id');
    }

    public function results()
    {
        return $this->hasMany(Result::class, 'student_id');
    }

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class, 'student_id');
    }
}
