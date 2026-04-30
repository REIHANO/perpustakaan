import React from 'react';
import { usePage } from '@inertiajs/react';
import { Alert } from '@themesberg/react-bootstrap';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const message = flash?.success || flash?.error;

    if (!message) {
        return null;
    }

    return (
        <Alert variant={flash?.error ? 'danger' : 'success'} className="shadow-sm">
            {message}
        </Alert>
    );
}
