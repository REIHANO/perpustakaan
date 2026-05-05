import React from 'react';
import moment from 'moment-timezone';
import { Row, Col } from '@themesberg/react-bootstrap';
import { useI18n } from '../lib/i18n';

export default function Footer() {
    const currentYear = moment().year();
    const { t } = useI18n();

    return (
        <footer className="footer section py-4 mt-11">
            <Row className="align-items-center">
                <Col xs={12} lg={6} className="mb-2 mb-lg-0">
                    <p className="mb-0 text-center text-lg-start text-muted">
                        {t('footer.copyright', 'Copyright © :year Sistem Informasi Perpustakaan').replace(':year', currentYear)}
                    </p>
                </Col>
                <Col xs={12} lg={6}>
                    <p className="mb-0 text-center text-lg-end text-muted">
                        {t('footer.credit', 'Volt React inspired UI for Laravel Inertia')}
                    </p>
                </Col>
            </Row>
        </footer>
    );
}
