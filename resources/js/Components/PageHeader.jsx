import React from 'react';

export default function PageHeader({ eyebrow, title, description, actions = null }) {
    return (
        <div className="mb-4 d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3">
            <div>
                {eyebrow ? <div className="text-uppercase small fw-bold text-primary">{eyebrow}</div> : null}
                <h1 className="h3 mb-1">{title}</h1>
                {description ? <p className="text-muted mb-0">{description}</p> : null}
            </div>
            {actions ? <div className="d-flex gap-2 flex-wrap">{actions}</div> : null}
        </div>
    );
}
