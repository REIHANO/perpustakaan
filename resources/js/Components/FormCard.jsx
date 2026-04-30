import React from 'react';
import { Card } from '@themesberg/react-bootstrap';

export default function FormCard({ title, subtitle, action = null, className = '', children }) {
    return (
        <Card className={`border-0 shadow-sm ${className}`.trim()}>
            {(title || subtitle || action) ? (
                <Card.Header className="bg-white border-bottom p-4 p-lg-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div>
                        {title ? <h5 className="mb-1">{title}</h5> : null}
                        {subtitle ? <p className="mb-0 text-muted">{subtitle}</p> : null}
                    </div>
                    {action}
                </Card.Header>
            ) : null}
            <Card.Body className="p-4 p-lg-5">
                {children}
            </Card.Body>
        </Card>
    );
}
