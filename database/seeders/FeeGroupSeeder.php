<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FeeGroup;
use App\Models\FeeGroupItem;
use App\Models\FeeType;
use App\Models\AcademicClass;

class FeeGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = AcademicClass::all();
        $feeTypes = FeeType::all();

        if ($feeTypes->isEmpty()) {
            $this->command->info('No Fee Types found. Please run FeeTypeSeeder first.');
            return;
        }
        
        $tuitionFee = $feeTypes->where('code', 'TUITION_FEE')->first();
        $libraryFee = $feeTypes->where('code', 'LIBRARY_FEE')->first();
        $sportsFee = $feeTypes->where('code', 'SPORTS_FEE')->first();
        $examFee = $feeTypes->where('code', 'EXAM_FEE')->first();
        $labFee = $feeTypes->where('code', 'LABORATORY_FEE')->first();
        
        // Truncate existing to prevent duplicates during re-seeding
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        FeeGroup::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        foreach ($classes as $index => $class) {
            // 1. Monthly Package for each class
            $monthlyGroup = FeeGroup::create([
                'academic_class_id' => $class->id,
                'name' => $class->name . ' Monthly Fees',
                'description' => 'Standard monthly fee package including tuition and facility fees for ' . $class->name,
                'is_active' => true,
            ]);

            // Increase amounts slightly based on index
            $baseTuition = 500 + ($index * 100); 
            if ($tuitionFee) $monthlyGroup->items()->create(['fee_type_id' => $tuitionFee->id, 'amount' => $baseTuition]);
            if ($libraryFee) $monthlyGroup->items()->create(['fee_type_id' => $libraryFee->id, 'amount' => 100.00]);
            if ($sportsFee) $monthlyGroup->items()->create(['fee_type_id' => $sportsFee->id, 'amount' => 50.00]);

            // 2. Exam Package for each class
            $examGroup = FeeGroup::create([
                'academic_class_id' => $class->id,
                'name' => $class->name . ' Half-Yearly Exam Fees',
                'description' => 'Half-yearly examination package for ' . $class->name,
                'is_active' => true,
            ]);

            $baseExam = 800 + ($index * 50);
            if ($examFee) $examGroup->items()->create(['fee_type_id' => $examFee->id, 'amount' => $baseExam]);
            // Only add lab fee for higher classes (e.g. index > 5)
            if ($labFee && $index > 5) $examGroup->items()->create(['fee_type_id' => $labFee->id, 'amount' => 300.00]);
        }

        // 3. General Admission Group (No specific class)
        $admissionFee = $feeTypes->where('code', 'ADMISSION_FEE')->first();
        $idCardFee = $feeTypes->where('code', 'ID_CARD_FEE')->first();

        $group3 = FeeGroup::create([
            'academic_class_id' => null,
            'name' => 'New Admission Package (General)',
            'description' => 'Standard admission fees applicable for all new students.',
            'is_active' => true,
        ]);

        if ($admissionFee) $group3->items()->create(['fee_type_id' => $admissionFee->id, 'amount' => 2000.00]);
        if ($idCardFee) $group3->items()->create(['fee_type_id' => $idCardFee->id, 'amount' => 150.00]);

        $this->command->info('Fee Groups seeded for all classes successfully!');
    }
}
