<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $locale = app()->getLocale();

        return array_merge(parent::share($request), [
            'locale' => $locale,
            'supportedLocales' => array_map(
                fn (array $config, string $code) => array_merge(['code' => $code], $config),
                config('i18n.supported_locales', []),
                array_keys(config('i18n.supported_locales', []))
            ),
            'translations' => fn () => require lang_path($locale . '/ui.php'),
            'auth' => [
                'user' => fn () => $request->user()
                    ? array_merge(
                        $request->user()->only('id', 'name', 'email', 'role'),
                        ['permissions' => $request->user()->permissionSlugs()]
                    )
                    : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'showForgotPasswordLink' => fn () => $request->session()->get('auth.show_forgot_password_link', false),
            ],
        ]);
    }
}
