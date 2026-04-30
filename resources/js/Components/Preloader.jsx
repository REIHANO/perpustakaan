import React from 'react';
import { Image } from '@themesberg/react-bootstrap';

export default function Preloader({ show }) {
    return (
        <div className={`preloader bg-soft flex-column justify-content-center align-items-center ${show ? '' : 'show'}`}>
            <Image
                className="loader-element animate__animated animate__jackInTheBox"
                src="/assets/img/technologies/react-logo.svg"
                height={40}
            />
        </div>
    );
}
