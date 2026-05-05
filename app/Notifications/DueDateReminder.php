<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DueDateReminder extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $name = $notifiable->name ?? __('ui.brand');

        return (new MailMessage)
            ->subject(__('email.due_date.subject'))
            ->markdown('mail.due-date-reminder', [
                'name' => $name,
                'dashboardUrl' => url('/dashboard'),
                'subject' => __('email.due_date.subject'),
                'greeting' => __('email.due_date.greeting', ['name' => $name]),
                'intro' => __('email.due_date.intro'),
                'reminder' => __('email.due_date.reminder'),
                'action' => __('email.due_date.action'),
                'closing' => __('email.due_date.closing'),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
