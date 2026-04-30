import React, { useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Row, Col, Form } from '@themesberg/react-bootstrap';
import SuperAdminLayout from '../../../Layouts/SuperAdminLayout';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';

const CIRCULATION_GROUP = [
    'manage-circulation',
    'set-fine',
];

function RolePermissionCard({ role, permissions, selectedIds }) {
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
                <p className="mb-0 text-muted">Atur permission untuk role ini.</p>
            </Card.Header>
            <Card.Body className="p-4 p-lg-5">
                <form onSubmit={submit} className="d-grid gap-3">
                    <div className="d-grid gap-2">
                        <div className="rounded-3 border bg-light p-3">
                            <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                <div>
                                    <div className="fw-semibold text-dark">Circulation + Fine</div>
                                    <div className="small text-muted">Permission untuk sirkulasi dan pengaturan denda.</div>
                                </div>
                                <Badge variant="info">Grouped</Badge>
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
                        Simpan Permission
                    </Button>
                </form>
            </Card.Body>
        </Card>
    );
}

export default function Index({ permissions, roles, rolePermissions }) {
    const createForm = useForm({
        name: '',
        slug: '',
        description: '',
    });

    const permissionRows = useMemo(() => permissions ?? [], [permissions]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post('/super-admin/permissions', {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    return (
        <SuperAdminLayout title="Permission Manager">
            <Head title="Super Admin Permissions" />

            <Row className="g-4">
                <Col xl={4}>
                    <FormCard title="Tambah Permission" subtitle="Buat permission baru untuk dipakai role.">
                        <form onSubmit={submitCreate} className="d-grid gap-3">
                            <Input label="Nama" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} error={createForm.errors.name} />
                            <Input label="Slug" value={createForm.data.slug} onChange={(e) => createForm.setData('slug', e.target.value)} error={createForm.errors.slug} />
                            <Input label="Deskripsi" value={createForm.data.description} onChange={(e) => createForm.setData('description', e.target.value)} error={createForm.errors.description} />
                            <Button type="submit" disabled={createForm.processing}>
                                Simpan
                            </Button>
                        </form>
                    </FormCard>
                </Col>

                <Col xl={8}>
                    <Table title="Daftar Permission" subtitle="Kelola permission yang tersedia di sistem">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nama</th>
                                    <th>Slug</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="table-light">
                                    <td colSpan={4}>
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                            <div>
                                                <div className="fw-semibold text-dark">Circulation + Fine</div>
                                                <div className="small text-muted">
                                                    Grup permission yang mengatur peminjaman, pengembalian, dan denda.
                                                </div>
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
                                                    onClick={() => {
                                                        const nextName = window.prompt('Nama permission', permission.name);
                                                        if (nextName === null) {
                                                            return;
                                                        }

                                                        const nextSlug = window.prompt('Slug permission', permission.slug);
                                                        if (nextSlug === null) {
                                                            return;
                                                        }

                                                        router.patch(`/super-admin/permissions/${permission.id}`, {
                                                            name: nextName,
                                                            slug: nextSlug,
                                                            description: permission.description || '',
                                                        }, { preserveScroll: true });
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="btn-sm"
                                                    onClick={() => router.delete(`/super-admin/permissions/${permission.id}`, { preserveScroll: true })}
                                                >
                                                    Hapus
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
