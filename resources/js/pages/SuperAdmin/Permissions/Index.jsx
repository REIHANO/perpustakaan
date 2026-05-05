import React, { useMemo, useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Row, Col, Form } from '@themesberg/react-bootstrap';
import SuperAdminLayout from '../../../Layouts/SuperAdminLayout';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { useI18n } from '../../../lib/i18n';

const CIRCULATION_GROUP = [
    'manage-circulation',
    'set-fine',
];

function RolePermissionCard({ role, permissions, selectedIds }) {
    const { t } = useI18n();
    const form = useForm({
        permission_ids: selectedIds,
    });

    const submit = (e) => {
        e.preventDefault();
        form.patch(`/super-admin/permissions/roles/${role}`, {
            preserveScroll: true,
        });
    };

    return (
            <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom p-4 p-lg-5">
                <h5 className="mb-1 text-capitalize">{role}</h5>
                <p className="mb-0 text-muted">{t('permissions.role_subtitle', 'Manage permissions for this role.')}</p>
            </Card.Header>
            <Card.Body className="p-4 p-lg-6">
                <form onSubmit={submit} className="d-grid gap-3">
                    <div className="d-grid gap-2">
                        <div className="rounded-3 border bg-light p-3">
                            <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                <div>
                                    <div className="fw-semibold text-dark">{t('permissions.group_title', 'Circulation + Fine')}</div>
                                    <div className="small text-muted">{t('permissions.group_subtitle', 'Permissions for circulation and fine settings.')}</div>
                                </div>
                                <Badge variant="info">{t('states.grouped', 'Grouped')}</Badge>
                            </div>

                            {permissions
                                .filter((permission) => CIRCULATION_GROUP.includes(permission.slug))
                                .map((permission) => (
                                    <Form.Check
                                        key={permission.id}
                                        type="checkbox"
                                        id={`${role}-${permission.slug}`}
                                        label={`${permission.name} (${permission.slug})`}
                                        checked={form.data.permission_ids.includes(permission.id)}
                                        onChange={(e) => {
                                            const next = e.target.checked
                                                ? [...form.data.permission_ids, permission.id]
                                                : form.data.permission_ids.filter((id) => id !== permission.id);
                                            form.setData('permission_ids', next);
                                        }}
                                    />
                                ))}
                        </div>

                        {permissions
                            .filter((permission) => !CIRCULATION_GROUP.includes(permission.slug))
                            .map((permission) => (
                                <Form.Check
                                    key={permission.id}
                                    type="checkbox"
                                    id={`${role}-${permission.slug}`}
                                    label={`${permission.name} (${permission.slug})`}
                                    checked={form.data.permission_ids.includes(permission.id)}
                                    onChange={(e) => {
                                        const next = e.target.checked
                                            ? [...form.data.permission_ids, permission.id]
                                            : form.data.permission_ids.filter((id) => id !== permission.id);
                                        form.setData('permission_ids', next);
                                    }}
                                />
                            ))}
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        {t('common.save', 'Save')}
                    </Button>
                </form>
            </Card.Body>
        </Card>
    );
}

export default function Index({ permissions, roles, rolePermissions }) {
    const [editingPermission, setEditingPermission] = useState(null);
    const permissionRows = useMemo(() => permissions ?? [], [permissions]);
    const { t } = useI18n();

    const form = useForm({
        name: '',
        slug: '',
        description: '',
    });

    const resetForm = () => {
        setEditingPermission(null);
        form.reset();
        form.clearErrors();
    };

    const startEdit = (permission) => {
        setEditingPermission(permission);
        form.setData('name', permission.name);
        form.setData('slug', permission.slug);
        form.setData('description', permission.description || '');
        form.clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: resetForm,
        };

        if (editingPermission) {
            form.patch(`/super-admin/permissions/${editingPermission.id}`, options);
            return;
        }

        form.post('/super-admin/permissions', options);
    };

    return (
        <SuperAdminLayout title={t('nav.permissions', 'Permissions')}>
            <Head title={t('nav.permissions', 'Permissions')} />

            <Row className="g-4">
                <Col xl={4}>
                    <FormCard
                        title={editingPermission ? t('common.edit', 'Edit') : t('actions.add', 'Add')}
                        subtitle={editingPermission ? t('permissions.edit_subtitle', 'Update the permission selected from the table.') : t('permissions.create_subtitle', 'Create a new permission for roles.')}
                        action={editingPermission ? (
                            <Button variant="secondary" className="btn-sm" onClick={resetForm}>
                                {t('common.cancel', 'Cancel')}
                            </Button>
                        ) : null}
                    >
                        <form onSubmit={submit} className="d-grid gap-3">
                            <Input
                                label={t('labels.name', 'Name')}
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                            />
                            <Input
                                label={t('labels.slug', 'Slug')}
                                value={form.data.slug}
                                onChange={(e) => form.setData('slug', e.target.value)}
                                error={form.errors.slug}
                                placeholder={editingPermission ? t('permissions.slug_required', 'Slug is required when editing') : t('permissions.slug_auto', 'Optional, auto from name')}
                            />
                            <Input
                                label={t('labels.description', 'Description')}
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                error={form.errors.description}
                            />
                            <Button type="submit" disabled={form.processing}>
                                {editingPermission ? t('common.update', 'Update') : t('common.save', 'Save')}
                            </Button>
                        </form>
                    </FormCard>
                </Col>

                <Col xl={8}>
                    <Table title={t('nav.permissions', 'Permissions')} subtitle={t('permissions.subtitle', 'Manage permissions available in the system')}>
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>{t('labels.name', 'Name')}</th>
                                    <th>{t('labels.slug', 'Slug')}</th>
                                    <th>{t('labels.description', 'Description')}</th>
                                    <th>{t('labels.action', 'Action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="table-light">
                                    <td colSpan={4}>
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                            <div>
                                                <div className="fw-semibold text-dark">{t('permissions.group_title', 'Circulation + Fine')}</div>
                                                <div className="small text-muted">{t('permissions.group_description', 'Grouped permissions that manage borrowing, returns, and fines.')}</div>
                                            </div>
                                            <Badge variant="primary">manage-circulation + set-fine</Badge>
                                        </div>
                                    </td>
                                </tr>
                                {permissionRows.map((permission) => (
                                    <tr key={permission.id}>
                                        <td className="fw-semibold text-dark">{permission.name}</td>
                                        <td><Badge variant="info">{permission.slug}</Badge></td>
                                        <td>{permission.description || '-'}</td>
                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <Button
                                                    variant="secondary"
                                                    className="btn-sm"
                                                    onClick={() => startEdit(permission)}
                                                >
                                                    {t('common.edit', 'Edit')}
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="btn-sm"
                                                    onClick={() => {
                                                        if (!window.confirm(`Hapus permission "${permission.name}"?`)) {
                                                            return;
                                                        }

                                                        router.delete(`/super-admin/permissions/${permission.id}`, { preserveScroll: true });
                                                    }}
                                                >
                                                    {t('common.delete', 'Delete')}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Table>
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                {roles.map((role) => (
                    <Col xl={6} key={role}>
                        <RolePermissionCard
                            key={`${role}-${(rolePermissions[role] || []).join('-')}`}
                            role={role}
                            permissions={permissions}
                            selectedIds={rolePermissions[role] || []}
                        />
                    </Col>
                ))}
            </Row>
        </SuperAdminLayout>
    );
}
