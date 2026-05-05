<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LanguageSwitchTest extends TestCase
{
    use RefreshDatabase;

    public function test_language_can_be_switched_via_session(): void
    {
        $this->from('/login')
            ->post('/language', [
                'locale' => 'en',
            ])
            ->assertRedirect('/login')
            ->assertSessionHas('locale', 'en');

        $this->withSession(['locale' => 'en'])
            ->get('/login')
            ->assertOk()
            ->assertSee('lang="en"', false);
    }
}
