<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param Request $request
     * @return RedirectResponse|JsonResponse
     */
    public function toResponse($request): RedirectResponse|JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return redirect()->intended('/dashboard');
        }

        return redirect()->intended('/');
    }
}
