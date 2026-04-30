import React from 'react';
import moment from 'moment-timezone';
import { Row, Col } from '@themesberg/react-bootstrap';

export default function Footer() {
    const currentYear = moment().year();

    return (
        <footer className="footer section py-4 mt-11">
            <Row className="align-items-center">
                <Col xs={12} lg={6} className="mb-2 mb-lg-0">
                    <p className="mb-0 text-center text-lg-start text-muted">
                        Copyright ©{currentYear} Sistem Informasi Perpustakaan
                    </p>
                </Col>
                <Col xs={12} lg={6}>
                    <p className="mb-0 text-center text-lg-end text-muted">Volt React inspired UI for Laravel Inertia</p>
                </Col>
            </Row>
        </footer>
    );
}
