import React from 'react';
import { Badge as BsBadge } from '@themesberg/react-bootstrap';

const variants = {
    neutral: 'secondary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
    primary: 'primary',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
    return (
        <BsBadge bg={variants[variant] || 'secondary'} pill className={className}>
            {children}
        </BsBadge>
    );
}
