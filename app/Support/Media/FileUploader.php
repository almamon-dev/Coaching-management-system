<?php

declare(strict_types=1);

namespace App\Support\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class FileUploader
{
    /**
     * Upload an UploadedFile to the default storage disk.
     */
    public static function upload(string $folder, ?UploadedFile $file): ?string
    {
        if (!$file?->isValid()) {
            return null;
        }

        $basePath = "uploads/{$folder}";
        $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
        $path = "{$basePath}/{$filename}";

        Storage::putFileAs($basePath, $file, $filename);

        return $path;
    }

    /**
     * Copy a file from a temporary local path to the default storage disk.
     */
    public static function saveFromPath(string $folder, string $filePath): ?string
    {
        if (!file_exists($filePath)) {
            return null;
        }

        $basePath = "uploads/{$folder}";
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $filename = time() . '_' . Str::random(8) . '.' . $extension;
        $path = "{$basePath}/{$filename}";

        Storage::put($path, file_get_contents($filePath));

        return $path;
    }
}
