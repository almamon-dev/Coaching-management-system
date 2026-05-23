<?php

declare(strict_types=1);

namespace App\Support\Generators;

use App\Support\Settings\SettingFetcher;
use Illuminate\Support\Str;

final class NumberGenerator
{
    /**
     * Generate a unique number with a prefix from settings.
     */
    public static function generate(string $settingKey, string $defaultPrefix, int $randomLength = 10): string
    {
        $prefix = SettingFetcher::get($settingKey, $defaultPrefix);
        return $prefix . strtoupper(Str::random($randomLength));
    }
}
