<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthLoginAttemptsTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_link_shows_after_three_failed_logins(): void
    {
        $user = User::factory()->create([
            'email' => 'member@example.com',
            'password' => 'secret-password',
        ]);

        for ($i = 0; $i < 3; $i++) {
        $this->from('/login')
            ->post('/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ])
                ->assertRedirect('/login');
        }

        $this->get('/login')
            ->assertOk()
            ->assertSee('"showForgotPasswordLink":true', false);
    }

    public function test_initial_login_page_does_not_show_stale_failed_attempt_state(): void
    {
        $this->withSession(['auth.login_failed_attempts' => 3])
            ->get('/login')
            ->assertOk()
            ->assertDontSee('Lupa password? Klik di sini untuk reset password.');
    }
}
