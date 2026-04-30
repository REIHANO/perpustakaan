import React from 'react';
import { Form } from '@themesberg/react-bootstrap';
import FormError from './FormError';

export default function Textarea({ label, error, className = '', ...props }) {
    return (
        <Form.Group className={className}>
            {label ? <Form.Label>{label}</Form.Label> : null}
            <Form.Control as="textarea" rows={4} {...props} />
            <FormError>{error}</FormError>
        </Form.Group>
    );
}
