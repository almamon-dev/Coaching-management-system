<?php

declare(strict_types=1);

namespace App\Services\Admin\Examinations;

use App\Repositories\Admin\Examinations\ExamRepository;

class BulkDestroyExamService
{
    public function __construct(
        protected ExamRepository $repository,
    ) {}

    public function execute(array $ids): int
    {
        return $this->repository->bulkDelete($ids);
    }
}
