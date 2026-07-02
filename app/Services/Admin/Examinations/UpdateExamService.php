<?php

declare(strict_types=1);

namespace App\Services\Admin\Examinations;

use App\Models\Exam;
use App\Repositories\Admin\Examinations\ExamRepository;

class UpdateExamService
{
    public function __construct(
        protected ExamRepository $repository,
    ) {}

    public function execute(Exam $exam, array $data): bool
    {
        return $this->repository->update($exam, $data);
    }
}
