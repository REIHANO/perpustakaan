import React from 'react';
import { Card, Table as BsTable } from '@themesberg/react-bootstrap';

export default function Table({ title, subtitle, children, action = null }) {
    return (
        <Card className="border-0 shadow-sm">
            {(title || subtitle || action) ? (
                <Card.Header className="border-bottom d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 bg-white">
                    <div>
                        {title ? <h5 className="mb-1">{title}</h5> : null}
                        {subtitle ? <p className="mb-0 text-muted">{subtitle}</p> : null}
                    </div>
                    {action}
                </Card.Header>
            ) : null}
            <Card.Body className="p-0">
                <div className="table-responsive">
                    <BsTable className="mb-0 align-middle">{children}</BsTable>
                </div>
            </Card.Body>
        </Card>
    );
}
