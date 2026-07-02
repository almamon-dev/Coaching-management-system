<?php

declare(strict_types=1);

namespace App\Services\Admin\Examinations;

use App\Repositories\Admin\Examinations\ExamRepository;
use Illuminate\Http\Request;

class IndexExamService
{
    public function __construct(
        protected ExamRepository $repository,
    ) {}

    public function execute(Request $request): array
    {
        return $this->repository->getExamList($request);
    }
}
