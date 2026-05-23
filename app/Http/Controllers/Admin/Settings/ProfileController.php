<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Services\Admin\Profile\ProfileService;
use Inertia\Inertia;

class ProfileController extends Controller
{
    protected $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Show the profile settings page
     */
    public function index()
    {
        return Inertia::render('Admin/Settings/General/ProfilePage', [
            'user' => $this->profileService->getProfileData()
        ]);
    }

    /**
     * Update the profile
     */
    public function update(UpdateProfileRequest $request)
    {
        $data = $request->only(['name', 'email', 'phone_number', 'designation', 'bio']);
        $file = $request->file('profile_picture');

        $this->profileService->updateProfile($data, $file);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Remove profile picture
     */
    public function removePicture()
    {
        $this->profileService->removeProfilePicture();

        return redirect()->back()->with('success', 'Profile picture removed.');
    }
}
