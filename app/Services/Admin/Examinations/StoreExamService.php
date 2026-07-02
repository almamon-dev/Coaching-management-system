<?php

declare(strict_types=1);

namespace App\Services\Admin\Examinations;

use App\Models\Exam;
use App\Repositories\Admin\Examinations\ExamRepository;

class StoreExamService
{
    public function __construct(
        protected ExamRepository $repository,
    ) {}

    public function execute(array $data): Exam
    {
        return $this->repository->create($data);
    }
}
