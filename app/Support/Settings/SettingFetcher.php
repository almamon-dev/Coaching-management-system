<?php

declare(strict_types=1);

namespace App\Support\Settings;

use App\Models\Setting;

final class SettingFetcher
{
    /**
     * Get a setting value by key.
     */
    public static function get(string $key, $default = null)
    {
        try {
            $setting = Setting::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        } catch (\Exception $e) {
            return $default;
        }
    }
}
