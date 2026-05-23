<?php

declare(strict_types=1);

namespace App\Support\Cache;

use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Cache;

final class CacheManager
{
    /**
     * Get cache store with automatic tag support detection.
     */
    public static function store(array $tags = []): Repository
    {
        $driver = config('cache.default');

        if (
            ! empty($tags) &&
            in_array($driver, ['redis', 'memcached'])
        ) {
            return Cache::tags($tags);
        }

        return Cache::store();
    }

    /**
     * Determine if cache tagging is supported.
     */
    public static function supportsTags(): bool
    {
        return in_array(config('cache.default'), [
            'redis',
            'memcached',
        ]);
    }
}
