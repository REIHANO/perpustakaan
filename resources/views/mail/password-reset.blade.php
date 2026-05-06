<x-mail::message>
<div style="text-align: center; padding: 8px 0 24px;">
<div style="display: inline-block; padding: 10px 18px; border-radius: 999px; background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%); color: #ffffff; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;">
{{ __('ui.brand') }}
</div>

<h1 style="margin: 18px 0 10px; font-size: 30px; line-height: 1.15; color: #111827;">
{{ $subject }}
</h1>

<p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.7;">
{{ $greeting }}
</p>
</div>

<x-mail::panel>
<div style="font-size: 16px; line-height: 1.7; color: #1f2937;">
    <p style="margin: 0 0 14px;">{{ $intro }}</p>
    <p style="margin: 0;">
        {{ $note }}
    </p>
</div>
</x-mail::panel>

<div style="text-align: center; margin: 28px 0 22px;">
<x-mail::button :url="$resetUrl">
{{ $cta }}
</x-mail::button>
</div>

<div style="margin: 0 0 24px; padding: 18px 20px; border: 1px solid #e5e7eb; border-radius: 14px; background: #f8fafc;">
<div style="font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #2563eb; margin-bottom: 8px;">
{{ $securityHeading }}
</div>
<div style="font-size: 14px; line-height: 1.7; color: #374151;">
{{ $securityNote }}
</div>
<div style="margin-top: 12px; font-size: 13px; line-height: 1.6; color: #6b7280;">
{{ $expires }}
</div>
</div>

<div style="padding: 16px 18px; border-left: 4px solid #2563eb; background: #eff6ff; border-radius: 12px;">
<div style="font-size: 13px; font-weight: 700; color: #1d4ed8; margin-bottom: 6px;">
{{ $fallback }}
</div>
<div style="font-size: 12px; line-height: 1.7; word-break: break-all; color: #374151;">
{{ $resetUrl }}
</div>
</div>

<x-slot:subcopy>
{{ __('email.password_reset.subcopy', ['url' => $resetUrl]) }}
</x-slot:subcopy>

{{ __('email.password_reset.signature') }}<br>
{{ config('app.name') }}
</x-mail::message>
