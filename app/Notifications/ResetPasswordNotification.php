<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $token)
    {
        //
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $resetUrl = route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->email,
        ]);

        return (new MailMessage)
            ->subject(__('email.password_reset.subject'))
            ->markdown('mail.password-reset', [
                'subject' => __('email.password_reset.subject'),
                'greeting' => __('email.password_reset.greeting', ['name' => $notifiable->name ?? __('ui.brand')]),
                'intro' => __('email.password_reset.intro'),
                'cta' => __('email.password_reset.cta'),
                'note' => __('email.password_reset.note'),
                'securityHeading' => __('email.password_reset.security_heading'),
                'securityNote' => __('email.password_reset.security_note'),
                'expires' => __('email.password_reset.expires'),
                'fallback' => __('email.password_reset.fallback'),
                'resetUrl' => $resetUrl,
            ]);
    }
}
