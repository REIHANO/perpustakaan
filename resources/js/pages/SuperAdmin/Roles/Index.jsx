import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, Row, Col, Form } from '@themesberg/react-bootstrap';
import SuperAdminLayout from '../../../Layouts/SuperAdminLayout';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';

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
    const circulationPermission = permissionRows.find((permission) => permission.slug === CIRCULATION_SLUG);
    const setFinePermission = permissionRows.find((permission) => permission.slug === SET_FINE_SLUG);

    const createForm = useForm({
        name: '',
        slug: '',
        description: '',
        permission_ids: [],
    });

    const editForm = useForm({
        name: '',
        description: '',
        permission_ids: [],
    });

    const resetCreate = () => {
        createForm.reset();
        createForm.clearErrors();
    };

    const startEdit = (role) => {
        setEditingRole(role);
        editForm.setData('name', role.name);
        editForm.setData('description', role.description || '');
        editForm.setData('permission_ids', role.permission_ids || []);
    };

    const applyPermission = (form, setData, permissionId, checked) => {
        const current = form.data.permission_ids;
        const next = checked
            ? [...current, permissionId]
            : current.filter((id) => id !== permissionId);

        setData(normalizePermissionIds(next, circulationPermission?.id, setFinePermission?.id));
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post('/super-admin/roles', {
            preserveScroll: true,
            onSuccess: resetCreate,
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        editForm.patch(`/super-admin/roles/${editingRole.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingRole(null);
                editForm.reset();
            },
        });
    };

    const renderPermissionChecks = (form, setData, prefix) => (
        <div className="d-grid gap-2">
            {permissionRows
                .filter((permission) => permission.slug !== SET_FINE_SLUG)
                .map((permission) => (
                    <Form.Check
                        key={permission.id}
                        type="checkbox"
                        id={`${prefix}-${permission.slug}`}
                        label={`${permission.name} (${permission.slug})`}
                        checked={form.data.permission_ids.includes(permission.id)}
                        onChange={(e) => applyPermission(form, setData, permission.id, e.target.checked)}
                    />
                ))}

            {circulationPermission && setFinePermission ? (
                <div className="rounded-3 border bg-light p-3 ms-3">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <div>
                            <div className="fw-semibold text-dark">Circulation + Fine</div>
                            <div className="small text-muted">Manage Circulation harus aktif sebelum Set Fine dipakai.</div>
                        </div>
                        <Badge variant="info">Grouped</Badge>
                    </div>

                    <Form.Check
                        type="checkbox"
                        id={`${prefix}-${circulationPermission.slug}`}
                        label={`${circulationPermission.name} (${circulationPermission.slug})`}
                        checked={form.data.permission_ids.includes(circulationPermission.id)}
                        onChange={(e) => applyPermission(form, setData, circulationPermission.id, e.target.checked)}
                    />
                    <Form.Check
                        className="mt-2"
                        type="checkbox"
                        id={`${prefix}-${setFinePermission.slug}`}
                        label={`${setFinePermission.name} (${setFinePermission.slug})`}
                        checked={form.data.permission_ids.includes(setFinePermission.id)}
                        disabled={!form.data.permission_ids.includes(circulationPermission.id)}
                        onChange={(e) => {
                            if (!form.data.permission_ids.includes(circulationPermission.id) && e.target.checked) {
                                return;
                            }

                            applyPermission(form, setData, setFinePermission.id, e.target.checked);
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
            return { variant: 'success', text: 'Bisa Set Denda' };
        }

        if (hasCirculation) {
            return { variant: 'warning', text: 'Circulation Only' };
        }

        return { variant: 'neutral', text: 'No Fine Access' };
    };

    return (
        <SuperAdminLayout title="Role Manager">
            <Head title="Super Admin Roles" />

            <Row className="g-4">
                <Col xl={4}>
                    <FormCard title="Tambah Role Baru" subtitle="Buat role custom berdasarkan permission.">
                        <form onSubmit={submitCreate} className="d-grid gap-3">
                            <Input
                                label="Nama Role"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                error={createForm.errors.name}
                            />
                            <Input
                                label="Slug Role"
                                value={createForm.data.slug}
                                onChange={(e) => createForm.setData('slug', e.target.value)}
                                error={createForm.errors.slug}
                                placeholder="opsional, otomatis dari nama"
                            />
                            <Input
                                label="Deskripsi"
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                error={createForm.errors.description}
                            />

                            {renderPermissionChecks(
                                createForm,
                                (ids) => createForm.setData('permission_ids', ids),
                                'create',
                            )}

                            <Button type="submit" disabled={createForm.processing}>
                                Simpan Role
                            </Button>
                        </form>
                    </FormCard>
                </Col>

                <Col xl={8}>
                    <Table title="Daftar Role" subtitle="Role sistem dan role custom yang tersedia">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nama</th>
                                    <th>Slug</th>
                                    <th>User</th>
                                    <th>Denda</th>
                                    <th>System</th>
                                    <th>Aksi</th>
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
                                            <td>{role.is_system ? 'Yes' : 'No'}</td>
                                            <td>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Button
                                                        variant="secondary"
                                                        className="btn-sm"
                                                        onClick={() => startEdit(role)}
                                                    >
                                                        Edit
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
                                                        Hapus
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

            {editingRole ? (
                <FormCard className="mt-4" title="Edit Role" subtitle="Nama dan permission bisa diperbarui tanpa mengubah slug.">
                    <form onSubmit={submitUpdate} className="d-grid gap-3">
                        <Input
                            label="Nama Role"
                            value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                            error={editForm.errors.name}
                        />
                        <Input
                            label="Deskripsi"
                            value={editForm.data.description}
                            onChange={(e) => editForm.setData('description', e.target.value)}
                            error={editForm.errors.description}
                        />

                        {renderPermissionChecks(
                            editForm,
                            (ids) => editForm.setData('permission_ids', ids),
                            'edit',
                        )}

                        <div className="d-flex gap-2">
                            <Button type="submit" disabled={editForm.processing}>
                                Update Role
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setEditingRole(null);
                                    editForm.reset();
                                }}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </FormCard>
            ) : null}
        </SuperAdminLayout>
    );
}
