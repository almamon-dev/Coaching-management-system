<?php

declare(strict_types=1);

namespace App\Services\Admin\Page;

use App\Models\Page;
use App\Repositories\Admin\Page\PageRepository;

class DestroyPageService
{
    protected PageRepository $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Execute purging of a custom page.
     */
    public function execute(Page $page): bool
    {
        if (in_array($page->slug, ['our-story', 'careers', 'privacy-policy', 'terms-and-conditions'])) {
            throw new \InvalidArgumentException('Core system pages cannot be deleted.');
        }

        return $this->repository->delete($page);
    }
}
