<?php

declare(strict_types=1);

namespace App\Services\Admin\Page;

use App\Models\Page;
use App\Repositories\Admin\Page\PageRepository;
use Illuminate\Support\Str;

class StorePageService
{
    protected PageRepository $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Execute storing of a new page.
     */
    public function execute(array $data): Page
    {
        $data['slug'] = Str::slug($data['title']);

        // Safe duplicate slug check
        if (Page::where('slug', $data['slug'])->exists()) {
            throw new \InvalidArgumentException('A page with a similar title/slug already exists.');
        }

        return $this->repository->create($data);
    }
}
