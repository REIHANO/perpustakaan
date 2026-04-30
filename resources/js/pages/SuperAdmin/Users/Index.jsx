import React, { useMemo } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Card, Row, Col } from '@themesberg/react-bootstrap';
import SuperAdminLayout from '../../../Layouts/SuperAdminLayout';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Select from '../../../Components/Select';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { hasPermission } from '../../../lib/permissions';

export default function Index({ users, roles }) {
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    const canManageUsers = hasPermission(permissions, 'manage-users');

    const defaultRole = roles.find((role) => role.slug === 'member')?.slug || roles[0]?.slug || 'member';

    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: defaultRole,
    });

    const updateForm = useForm({
        id: null,
        name: '',
        email: '',
        password: '',
        role: defaultRole,
    });

    const tableRows = useMemo(() => users.data ?? [], [users]);

    const submitCreate = (e) => {
        e.preventDefault();
        form.post('/super-admin/users', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        updateForm.patch(`/super-admin/users/${updateForm.data.id}`, {
            preserveScroll: true,
            onSuccess: () => updateForm.reset(),
        });
    };

    return (
        <SuperAdminLayout title="Manage Users">
            <Head title="Super Admin Users" />

            <Row className="g-4">
                {canManageUsers ? (
                    <Col xl={4}>
                        <FormCard title="Tambah User" subtitle="Buat user baru dan tentukan role awal.">
                            <form onSubmit={submitCreate} className="d-grid gap-3">
                                <Input label="Nama" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} error={form.errors.name} />
                                <Input label="Email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} error={form.errors.email} />
                                <Input label="Password" type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} error={form.errors.password} />
                                <Select label="Role" value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} error={form.errors.role}>
                                    {roles.map((role) => (
                                        <option key={role.slug} value={role.slug}>{role.name}</option>
                                    ))}
                                </Select>
                                <Button type="submit" disabled={form.processing} className="w-100">
                                    Simpan
                                </Button>
                            </form>
                        </FormCard>
                    </Col>
                ) : null}

                <Col xl={canManageUsers ? 8 : 12}>
                    <Table title="Daftar User" subtitle="Edit role, ganti password, atau hapus user">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((user) => (
                                    <tr key={user.id}>
                                        <td className="fw-semibold text-dark">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Badge variant={user.role === 'super-admin' ? 'danger' : user.role === 'admin' ? 'warning' : 'success'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td>
                                            {canManageUsers ? (
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Button
                                                        variant="secondary"
                                                        className="btn-sm"
                                                        onClick={() => {
                                                            updateForm.setData('id', user.id);
                                                            updateForm.setData('name', user.name);
                                                            updateForm.setData('email', user.email);
                                                            updateForm.setData('password', '');
                                                            updateForm.setData('role', user.role);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        className="btn-sm"
                                                        onClick={() => router.delete(`/super-admin/users/${user.id}`, { preserveScroll: true })}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-muted small">Tidak ada akses</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Table>

                    {canManageUsers ? (
                        <FormCard className="mt-4" title="Update User" subtitle="Pilih user dari tabel lalu perbarui datanya di sini.">
                            <form onSubmit={submitUpdate} className="d-grid gap-3">
                                <Input label="Nama" value={updateForm.data.name} onChange={(e) => updateForm.setData('name', e.target.value)} error={updateForm.errors.name} />
                                <Input label="Email" type="email" value={updateForm.data.email} onChange={(e) => updateForm.setData('email', e.target.value)} error={updateForm.errors.email} />
                                <Input label="Password Baru" type="password" value={updateForm.data.password} onChange={(e) => updateForm.setData('password', e.target.value)} error={updateForm.errors.password} />
                                <Select label="Role" value={updateForm.data.role} onChange={(e) => updateForm.setData('role', e.target.value)} error={updateForm.errors.role}>
                                    {roles.map((role) => (
                                        <option key={role.slug} value={role.slug}>{role.name}</option>
                                    ))}
                                </Select>
                                <Button type="submit" disabled={updateForm.processing || !updateForm.data.id}>
                                    Update
                                </Button>
                            </form>
                        </FormCard>
                    ) : null}
                </Col>
            </Row>
        </SuperAdminLayout>
    );
}
