<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function redirectFor(User $user): string
    {
        return match (true) {
            $user->isSuperAdmin() => route('super-admin.dashboard'),
            $user->canPermission('manage-books')
                || $user->canPermission('manage-categories')
                || $user->canPermission('manage-circulation')
                || $user->canPermission('set-fine')
                || $user->canPermission('view-reports') => route('admin.dashboard'),
            default => route('member.dashboard'),
        };
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => User::ROLE_MEMBER,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->to($this->redirectFor($user));
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => __('Email atau password salah.'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->to($this->redirectFor($request->user()));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login.form');
    }
}
