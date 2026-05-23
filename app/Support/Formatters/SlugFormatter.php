<?php

declare(strict_types=1);

namespace App\Support\Formatters;

final class SlugFormatter
{
    /**
     * Get the last segment of a slug path.
     */
    public static function getLastSlugSegment(string $slug): string
    {
        $segments = explode('/', $slug);
        return (string) end($segments);
    }
}
