<?php

declare(strict_types=1);

namespace App\Services\Admin\Profile;

use App\Support\Media\FileUrlGenerator;
use App\Support\Media\FileRemover;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\Auth;

class ProfileService
{
    /**
     * Get formatted user profile data
     */
    public function getProfileData()
    {
        $user = Auth::user();
        
        return [
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'designation' => $user->designation,
            'bio' => $user->bio,
            'profile_picture' => FileUrlGenerator::generate($user->profile_picture),
        ];
    }

    /**
     * Update user profile
     */
    public function updateProfile(array $data, $file = null)
    {
        $user = Auth::user();

        if ($file) {
            // Delete old picture if it exists
            if ($user->profile_picture) {
                FileRemover::delete($user->profile_picture);
            }
            
            // Upload new picture
            $path = FileUploader::upload('profiles', $file);
            if ($path) {
                $data['profile_picture'] = $path;
            }
        }

        return $user->update($data);
    }

    /**
     * Remove user profile picture
     */
    public function removeProfilePicture()
    {
        $user = Auth::user();
        
        if ($user->profile_picture) {
            FileRemover::delete($user->profile_picture);
            $user->update(['profile_picture' => null]);
            return true;
        }

        return false;
    }
}
