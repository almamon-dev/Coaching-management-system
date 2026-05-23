<?php

declare(strict_types=1);

namespace App\Support\Media;

final class FileUrlGenerator
{
    /**
     * Generate a public URL for the uploaded file.
     */
    public static function generate(?string $filePath): ?string
    {
        if (blank($filePath)) {
            return null;
        }

        $filePath = ltrim($filePath, '/');

        if (str_starts_with($filePath, 'storage/')) {
            $filePath = substr($filePath, 8);
        }

        if (str_starts_with($filePath, 'http://') || str_starts_with($filePath, 'https://')) {
            return $filePath;
        }

        return asset($filePath);
    }
}
