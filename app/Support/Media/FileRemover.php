<?php

declare(strict_types=1);

namespace App\Support\Media;



final class FileRemover
{
    /**
     * Delete a file from the default storage disk.
     */
    public static function delete(?string $filePath): bool
    {
        if (!$filePath) {
            return false;
        }

        // Clean up path
        $filePath = ltrim($filePath, '/');
        if (str_starts_with($filePath, 'storage/')) {
            $filePath = substr($filePath, 8);
        }

        $fullPath = public_path($filePath);
        if (file_exists($fullPath) && is_file($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }
}
