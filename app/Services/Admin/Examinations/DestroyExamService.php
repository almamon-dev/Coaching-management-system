<?php

declare(strict_types=1);

namespace App\Services\Admin\Examinations;

use App\Models\Exam;
use App\Repositories\Admin\Examinations\ExamRepository;

class DestroyExamService
{
    public function __construct(
        protected ExamRepository $repository,
    ) {}

    public function execute(Exam $exam): bool
    {
        return $this->repository->delete($exam);
    }
}
