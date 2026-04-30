import React from 'react';

export default function FormError({ children }) {
    if (!children) {
        return null;
    }

    return <div className="text-danger small mt-1">{children}</div>;
}
