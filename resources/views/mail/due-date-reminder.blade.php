<x-mail::message>
# {{ $subject }}

{{ $greeting }}

{{ $intro }}

<x-mail::panel>
{{ $reminder }}
</x-mail::panel>

<x-mail::button :url="$dashboardUrl">
{{ $action }}
</x-mail::button>

{{ $closing }}

{{ __('ui.brand') }}<br>
{{ config('app.name') }}
</x-mail::message>
