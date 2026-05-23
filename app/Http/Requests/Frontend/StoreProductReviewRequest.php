<?php

declare(strict_types=1);

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:5'],
            'images.*' => ['nullable', 'image', 'max:2048'],
            'videos.*' => ['nullable', 'file', 'mimes:mp4,mov,ogg,qt', 'max:51200'],
        ];
    }
}
