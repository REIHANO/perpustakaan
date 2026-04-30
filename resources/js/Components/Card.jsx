import React from 'react';
import { Card as BsCard } from '@themesberg/react-bootstrap';

export default function Card({ className = '', children }) {
    return <BsCard className={`border-0 shadow-sm ${className}`.trim()}>{children}</BsCard>;
}
