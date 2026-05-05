import React from 'react';
import { Card, Row, Col } from '@themesberg/react-bootstrap';
import Badge from './Badge';
import { useI18n } from '../lib/i18n';

export default function StatCard({ label, value, help, icon = 'bi-graph-up', variant = 'primary' }) {
    const { t } = useI18n();

    return (
        <Card className="card-body border-0 shadow-sm">
            <Row className="align-items-center">
                <Col>
                    <h6 className="text-uppercase text-muted mb-2">{label}</h6>
                    <h2 className="h1 mb-0">{value}</h2>
                </Col>
                <Col xs="auto">
                    <Badge variant={variant}>
                        <i className={`bi ${icon} me-1`} />
                        {t('labels.stat', 'Stat')}
                    </Badge>
                </Col>
            </Row>
            {help ? <p className="text-muted mt-3 mb-0">{help}</p> : null}
        </Card>
    );
}
