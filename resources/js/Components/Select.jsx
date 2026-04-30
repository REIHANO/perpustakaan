import React from 'react';
import { Form } from '@themesberg/react-bootstrap';
import FormError from './FormError';

export default function Select({ label, error, className = '', children, ...props }) {
    return (
        <Form.Group className={className}>
            {label ? <Form.Label>{label}</Form.Label> : null}
            <Form.Select {...props}>{children}</Form.Select>
            <FormError>{error}</FormError>
        </Form.Group>
    );
}
