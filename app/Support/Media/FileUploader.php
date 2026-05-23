<?php

declare(strict_types=1);

namespace App\Support\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

final class FileUploader
{
    /**
     * Upload an UploadedFile to public/uploads/{folder}.
     */
    public static function upload(string $folder, ?UploadedFile $file): ?string
    {
        if (!$file?->isValid()) {
            return null;
        }

        $basePath = "uploads/{$folder}";
        $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();

        $file->move(public_path($basePath), $filename);

        return "{$basePath}/{$filename}";
    }

    /**
     * Copy a file from a temporary local path to public/uploads/{folder}.
     */
    public static function saveFromPath(string $folder, string $filePath): ?string
    {
        if (!file_exists($filePath)) {
            return null;
        }

        $basePath = "uploads/{$folder}";
        $fullPath = public_path($basePath);
        File::ensureDirectoryExists($fullPath);

        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $filename = time() . '_' . Str::random(8) . '.' . $extension;

        if (copy($filePath, "{$fullPath}/{$filename}")) {
            return "{$basePath}/{$filename}";
        }

        return null;
    }
}
