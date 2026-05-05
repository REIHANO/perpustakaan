import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Row, Col, Form } from '@themesberg/react-bootstrap';
import SuperAdminLayout from '../../../Layouts/SuperAdminLayout';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { useI18n } from '../../../lib/i18n';

const CIRCULATION_SLUG = 'manage-circulation';
const SET_FINE_SLUG = 'set-fine';

function normalizePermissionIds(permissionIds, circulationId, setFineId) {
    const uniqueIds = [...new Set(permissionIds.filter(Boolean).map((id) => Number(id)))];

    if (!circulationId || !setFineId) {
        return uniqueIds;
    }

    const hasCirculation = uniqueIds.includes(circulationId);
    const hasSetFine = uniqueIds.includes(setFineId);

    if (hasSetFine && !hasCirculation) {
        uniqueIds.push(circulationId);
    }

    if (!uniqueIds.includes(circulationId)) {
        return uniqueIds.filter((id) => id !== setFineId);
    }

    return uniqueIds;
}

export default function Index({ roles, permissions }) {
    const [editingRole, setEditingRole] = useState(null);
    const permissionRows = useMemo(() => permissions ?? [], [permissions]);
    const { t } = useI18n();
    const circulationPermission = permissionRows.find((permission) => permission.slug === CIRCULATION_SLUG);
    const setFinePermission = permissionRows.find((permission) => permission.slug === SET_FINE_SLUG);

    const form = useForm({
        name: '',
        slug: '',
        description: '',
        permission_ids: [],
    });

    const resetForm = () => {
        setEditingRole(null);
        form.reset();
        form.clearErrors();
    };

    const startEdit = (role) => {
        setEditingRole(role);
        form.setData('name', role.name);
        form.setData('slug', role.slug);
        form.setData('description', role.description || '');
        form.setData('permission_ids', role.permission_ids || []);
        form.clearErrors();
    };

    const applyPermission = (currentForm, setData, permissionId, checked) => {
        const current = currentForm.data.permission_ids;
        const next = checked
            ? [...current, permissionId]
            : current.filter((id) => id !== permissionId);

        setData(normalizePermissionIds(next, circulationPermission?.id, setFinePermission?.id));
    };

    const submit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: resetForm,
        };

        if (editingRole) {
            form.patch(`/super-admin/roles/${editingRole.id}`, options);
            return;
        }

        form.post('/super-admin/roles', options);
    };

    const renderPermissionChecks = (currentForm, setData, prefix) => (
        <div className="d-grid gap-2">
            {permissionRows
                .filter((permission) => permission.slug !== SET_FINE_SLUG)
                .map((permission) => (
                    <Form.Check
                        key={permission.id}
                        type="checkbox"
                        id={`${prefix}-${permission.slug}`}
                        label={`${permission.name} (${permission.slug})`}
                        checked={currentForm.data.permission_ids.includes(permission.id)}
                        onChange={(e) => applyPermission(currentForm, setData, permission.id, e.target.checked)}
                    />
                ))}

            {circulationPermission && setFinePermission ? (
                <div className="rounded-3 border bg-light p-3 ms-3">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <div>
                            <div className="fw-semibold text-dark">{t('permissions.group_title', 'Circulation + Fine')}</div>
                            <div className="small text-muted">{t('roles.fine_dependency', 'Manage Circulation must be active before Set Fine can be used.')}</div>
                        </div>
                        <Badge variant="info">{t('states.grouped', 'Grouped')}</Badge>
                    </div>

                    <Form.Check
                        type="checkbox"
                        id={`${prefix}-${circulationPermission.slug}`}
                        label={`${circulationPermission.name} (${circulationPermission.slug})`}
                        checked={currentForm.data.permission_ids.includes(circulationPermission.id)}
                        onChange={(e) => applyPermission(currentForm, setData, circulationPermission.id, e.target.checked)}
                    />
                    <Form.Check
                        className="mt-2"
                        type="checkbox"
                        id={`${prefix}-${setFinePermission.slug}`}
                        label={`${setFinePermission.name} (${setFinePermission.slug})`}
                        checked={currentForm.data.permission_ids.includes(setFinePermission.id)}
                        disabled={!currentForm.data.permission_ids.includes(circulationPermission.id)}
                        onChange={(e) => {
                            if (!currentForm.data.permission_ids.includes(circulationPermission.id) && e.target.checked) {
                                return;
                            }

                            applyPermission(currentForm, setData, setFinePermission.id, e.target.checked);
                        }}
                    />
                </div>
            ) : null}
        </div>
    );

    const fineAccessBadge = (permissionIds) => {
        const hasCirculation = circulationPermission ? permissionIds.includes(circulationPermission.id) : false;
        const hasSetFine = setFinePermission ? permissionIds.includes(setFinePermission.id) : false;

        if (hasCirculation && hasSetFine) {
            return { variant: 'success', text: t('roles.fine_access', 'Can set fine') };
        }

        if (hasCirculation) {
            return { variant: 'warning', text: t('roles.circulation_only', 'Circulation only') };
        }

        return { variant: 'neutral', text: t('roles.no_fine_access', 'No fine access') };
    };

    return (
        <SuperAdminLayout title={t('nav.roles', 'Roles')}>
            <Head title={t('nav.roles', 'Roles')} />

            <Row className="g-4">
                <Col xl={4}>
                    <FormCard
                        title={editingRole ? t('common.edit', 'Edit') : t('actions.add', 'Add')}
                        subtitle={editingRole ? t('roles.edit_subtitle', 'Update the role selected from the table.') : t('roles.create_subtitle', 'Create a custom role based on permissions.')}
                        action={editingRole ? (
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
                            {editingRole ? (
                                <Input
                                    label={t('labels.slug', 'Slug')}
                                    value={form.data.slug}
                                    disabled
                                    readOnly
                                    placeholder={t('roles.slug_locked', 'Slug cannot be changed while editing')}
                                />
                            ) : (
                                <Input
                                    label={t('labels.slug', 'Slug')}
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    error={form.errors.slug}
                                    placeholder={t('roles.slug_auto', 'Optional, auto from name')}
                                />
                            )}
                            <Input
                                label={t('labels.description', 'Description')}
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                error={form.errors.description}
                            />

                            {renderPermissionChecks(
                                form,
                                (ids) => form.setData('permission_ids', ids),
                                editingRole ? 'edit' : 'create',
                            )}

                            <Button type="submit" disabled={form.processing}>
                                {editingRole ? t('common.update', 'Update') : t('common.save', 'Save')}
                            </Button>
                        </form>
                    </FormCard>
                </Col>

                <Col xl={8}>
                    <Table title={t('nav.roles', 'Roles')} subtitle={t('roles.subtitle', 'System and custom roles available')}>
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>{t('labels.name', 'Name')}</th>
                                    <th>{t('labels.slug', 'Slug')}</th>
                                    <th>{t('labels.members', 'Members')}</th>
                                    <th>{t('labels.fine', 'Fine')}</th>
                                    <th>{t('roles.system', 'System')}</th>
                                    <th>{t('labels.action', 'Action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => {
                                    const badge = fineAccessBadge(role.permission_ids || []);

                                    return (
                                        <tr key={role.id}>
                                            <td className="fw-semibold text-dark">{role.name}</td>
                                            <td>
                                                <Badge variant="info">{role.slug}</Badge>
                                            </td>
                                            <td>{role.users_count}</td>
                                            <td>
                                                <Badge variant={badge.variant}>{badge.text}</Badge>
                                            </td>
                                            <td>{role.is_system ? t('states.yes', 'Yes') : t('states.no', 'No')}</td>
                                            <td>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Button
                                                        variant="secondary"
                                                        className="btn-sm"
                                                        onClick={() => startEdit(role)}
                                                    >
                                                        {t('common.edit', 'Edit')}
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        className="btn-sm"
                                                        onClick={() => {
                                                            if (!window.confirm(`Hapus role "${role.name}"? User yang masih memakai role ini akan dipindahkan ke member.`)) {
                                                                return;
                                                            }

                                                            router.delete(`/super-admin/roles/${role.id}`, { preserveScroll: true });
                                                        }}
                                                        disabled={role.is_system}
                                                    >
                                                        {t('common.delete', 'Delete')}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Table>
                </Col>
            </Row>
        </SuperAdminLayout>
    );
}
