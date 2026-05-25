<?php

declare(strict_types=1);

namespace App\Support\Media;

use Illuminate\Support\Facades\Storage;

final class FileUrlGenerator
{
    /**
     * Generate a public URL for the uploaded file using the default storage disk.
     */
    public static function generate(?string $filePath): ?string
    {
        if (blank($filePath)) {
            return null;
        }

        if (str_starts_with($filePath, 'http://') || str_starts_with($filePath, 'https://')) {
            return $filePath;
        }

        // Clean up leading slashes or 'storage/' prefix to get the raw path
        $filePath = ltrim($filePath, '/');
        if (str_starts_with($filePath, 'storage/')) {
            $filePath = substr($filePath, 8);
        }

        // Return a relative path to avoid APP_URL port mismatch issues
        return '/storage/' . $filePath;
    }
}
