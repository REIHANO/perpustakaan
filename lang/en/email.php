<?php

return [
    'password_reset' => [
        'subject' => 'Reset Your Password',
        'greeting' => 'Hi :name,',
        'intro' => 'We received a request to reset the password for your account.',
        'cta' => 'Reset Password',
        'note' => 'Click the button below to create a new password and get back into your account.',
        'security_heading' => 'Safe and quick',
        'security_note' => 'This password reset link is private and will expire in 60 minutes.',
        'expires' => 'If you did not request a password reset, you can safely ignore this email.',
        'fallback' => 'If the button does not work, copy the link below into your browser:',
        'subcopy' => 'If you’re having trouble clicking the ":url" button, copy and paste the URL below into your web browser: :url',
        'signature' => 'Regards,',
    ],
    'due_date' => [
        'subject' => 'Book Due Date Reminder',
        'greeting' => 'Hi :name,',
        'intro' => 'A borrowed book is due soon.',
        'reminder' => 'Please return the book soon to avoid late fees.',
        'action' => 'View Borrowings',
        'closing' => 'Thanks for helping keep the library collection in great shape.',
    ],
];
