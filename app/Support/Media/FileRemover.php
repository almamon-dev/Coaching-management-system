<?php

declare(strict_types=1);

namespace App\Support\Media;

final class FileRemover
{
    /**
     * Delete a file from public path.
     */
    public static function delete(?string $filePath): bool
    {
        if (!$filePath) {
            return false;
        }

        $fullPath = public_path($filePath);

        return (file_exists($fullPath) && is_file($fullPath)) && @unlink($fullPath);
    }
}
