import React from 'react';
import { Button as BsButton } from '@themesberg/react-bootstrap';
import { Link } from '@inertiajs/react';


const variants = {
    primary: 'primary',
    secondary: 'secondary',
    danger: 'danger',
    ghost: 'light',
};

export default function Button({ as: Component, variant = 'primary', className = '', type = 'button', disabled = false, onClick, ...props }) {
    const resolvedAs = Component || (props.href ? Link : 'button');

   const handleClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        if (onClick) onClick(e);
    };

    return (
        <BsButton
            as={resolvedAs}
            type={resolvedAs === 'button' ? type : undefined}
            variant={variants[variant] || 'primary'}
            className={`${className} ${disabled ? 'disabled' : ''}`} // Tambah class 'disabled' untuk styling Bootstrap
            {...props}
            disabled={disabled} // Mengirim ke BsButton
            onClick={handleClick} // Gunakan handler pencegah klik
            aria-disabled={disabled} // Untuk aksesibilitas
        />
    );
};