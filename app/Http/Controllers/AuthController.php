<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Inertia\Response;

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
            $failedLoginAttempts = ((int) $request->session()->get('auth.login_failed_attempts', 0)) + 1;
            $request->session()->put('auth.login_failed_attempts', $failedLoginAttempts);
            $request->session()->flash('auth.show_forgot_password_link', $failedLoginAttempts >= 3);

            throw ValidationException::withMessages([
                'email' => __('ui.auth.login_error'),
            ]);
        }

        $request->session()->forget('auth.login_failed_attempts');
        $request->session()->regenerate();

        return redirect()->to($this->redirectFor($request->user()));
    }

    public function forgotPasswordForm(Request $request): Response
    {
        return inertia('Auth/ForgotPassword', [
            'status' => $request->session()->get('status'),
        ]);
    }

    public function sendResetLink(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink($validated);

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }

    public function resetPasswordForm(Request $request, string $token): Response
    {
        return inertia('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
            'status' => $request->session()->get('status'),
        ]);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login.form')->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login.form');
    }
}
