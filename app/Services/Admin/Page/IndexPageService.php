<?php

declare(strict_types=1);

namespace App\Services\Admin\Page;

use App\Repositories\Admin\Page\PageRepository;
use Illuminate\Http\Request;

class IndexPageService
{
    protected PageRepository $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Execute the page index query service returning paginated records and list stats.
     */
    public function execute(Request $request): array
    {
        return [
            'pages' => $this->repository->getPageList($request),
            'stats' => $this->repository->getStats()
        ];
    }
}
