<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_sends_reset_link_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'member@example.com',
            'password' => 'secret-password',
        ]);

        $this->from('/forgot-password')
            ->post('/forgot-password', [
                'email' => $user->email,
            ])
            ->assertRedirect('/forgot-password');

        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'member@example.com',
            'password' => 'secret-password',
        ]);

        $token = Password::broker()->createToken($user);

        $this->from('/reset-password/' . $token . '?email=' . urlencode($user->email))
            ->post('/reset-password', [
                'token' => $token,
                'email' => $user->email,
                'password' => 'new-secret-password',
                'password_confirmation' => 'new-secret-password',
            ])
            ->assertRedirect('/login');

        $this->assertTrue(Hash::check('new-secret-password', $user->fresh()->password));
    }
}
