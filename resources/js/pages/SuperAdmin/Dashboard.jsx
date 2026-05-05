import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, Row, Col } from '@themesberg/react-bootstrap';
import SuperAdminLayout from '../../Layouts/SuperAdminLayout';
import StatCard from '../../Components/StatCard';
import Badge from '../../Components/Badge';
import { useI18n } from '../../lib/i18n';

export default function Dashboard({ stats, rolesSummary }) {
    const { t } = useI18n();

    return (
        <SuperAdminLayout title={t('dashboard.super_admin', 'Super Admin Dashboard')}>
            <Head title={t('dashboard.super_admin', 'Super Admin Dashboard')} />

            <Row className="g-4">
                <Col md={6} xl={4}>
                    <StatCard label="Total User" value={stats.users} icon="bi-people" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Super Admin" value={stats.superAdmins} icon="bi-shield-lock" variant="danger" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Permissions" value={stats.permissions} icon="bi-key" variant="info" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Roles" value={stats.roles} icon="bi-diagram-3" variant="primary" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Admin" value={stats.admins} icon="bi-person-badge" variant="warning" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Member" value={stats.members} icon="bi-person" variant="success" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Custom Roles" value={stats.customRoles} icon="bi-stars" variant="danger" />
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-1">{t('super_admin.role_summary', 'Role Summary')}</h5>
                            <p className="mb-0 text-muted">{t('super_admin.role_summary_subtitle', 'User and permission distribution per role.')}</p>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                {rolesSummary.map((role) => (
                                    <Col md={4} key={role.role}>
                                        <div className="rounded-4 border bg-light p-4 h-100">
                                            <div className="fw-semibold text-dark">{role.label}</div>
                                            <div className="small text-muted mt-1">{role.users} user</div>
                                            <div className="mt-3">
                                                <Badge variant="primary">{role.permissions} permissions</Badge>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </SuperAdminLayout>
    );
}
