<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    /**
     * Mark the authenticated user's onboarding as complete.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsComplete(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->has_seen_onboarding = true;
            $user->save();

            return redirect()->back()->with('success', 'Onboarding complete.');
        }

        return redirect()->back()->with('error', 'User not found.');
    }
}