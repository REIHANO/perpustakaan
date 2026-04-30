import React from 'react';
import { Form } from '@themesberg/react-bootstrap';
import FormError from './FormError';

export default function Input({ label, error, className = '', ...props }) {
    return (
        <Form.Group className={className}>
            {label ? <Form.Label>{label}</Form.Label> : null}
            <Form.Control {...props} />
            <FormError>{error}</FormError>
        </Form.Group>
    );
}
