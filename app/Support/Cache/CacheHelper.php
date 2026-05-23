<?php

declare(strict_types=1);

namespace App\Support\Cache;

final class CacheHelper
{
    /**
     * Get cache TTL for daily cache.
     */
    public static function day(): int
    {
        return now()->addDay()->timestamp;
    }

    /**
     * Get cache TTL for hourly cache.
     */
    public static function hour(): int
    {
        return now()->addHour()->timestamp;
    }
}
