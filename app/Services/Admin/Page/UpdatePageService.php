<?php

declare(strict_types=1);

namespace App\Services\Admin\Page;

use App\Models\Page;
use App\Repositories\Admin\Page\PageRepository;
use Illuminate\Support\Str;

class UpdatePageService
{
    protected PageRepository $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Execute updating of a page.
     */
    public function execute(Page $page, array $data): bool
    {
        // System page path safety locks
        if (!in_array($page->slug, ['our-story', 'careers', 'privacy-policy', 'terms-and-conditions'])) {
            $data['slug'] = Str::slug($data['title']);

            // Duplicate slug check excluding itself
            if (Page::where('slug', $data['slug'])->where('id', '!=', $page->id)->exists()) {
                throw new \InvalidArgumentException('A page with a similar title/slug already exists.');
            }
        } else {
            // Keep current slug for core system layouts
            unset($data['slug']);
        }

        return $this->repository->update($page, $data);
    }
}
