import React, { useMemo, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Row, Col } from '@themesberg/react-bootstrap';
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
    const [editingUser, setEditingUser] = useState(null);

    const defaultRole = roles.find((role) => role.slug === 'member')?.slug || roles[0]?.slug || 'member';

    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: defaultRole,
    });

    const tableRows = useMemo(() => users.data ?? [], [users]);

    const resetForm = () => {
        setEditingUser(null);
        form.reset();
        form.clearErrors();
        form.setData('role', defaultRole);
    };

    const startEdit = (user) => {
        setEditingUser(user);
        form.setData('name', user.name);
        form.setData('email', user.email);
        form.setData('password', '');
        form.setData('role', user.role);
        form.clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: resetForm,
        };

        if (editingUser) {
            form.patch(`/super-admin/users/${editingUser.id}`, options);
            return;
        }

        form.post('/super-admin/users', options);
    };

    return (
        <SuperAdminLayout title="Manage Users">
            <Head title="Super Admin Users" />

            <Row className="g-4">
                {canManageUsers ? (
                    <Col xl={4}>
                        <FormCard
                            title={editingUser ? 'Edit User' : 'Tambah User'}
                            subtitle={editingUser ? 'Pilih user dari tabel lalu perbarui datanya di sini.' : 'Buat user baru dan tentukan role awal.'}
                            action={editingUser ? (
                                <Button variant="secondary" className="btn-sm" onClick={resetForm}>
                                    Batal Edit
                                </Button>
                            ) : null}
                        >
                            <form onSubmit={submit} className="d-grid gap-3">
                                <Input label="Nama" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} error={form.errors.name} />
                                <Input label="Email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} error={form.errors.email} />
                                <Input
                                    label={editingUser ? 'Password Baru' : 'Password'}
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    error={form.errors.password}
                                    placeholder={editingUser ? 'Kosongkan jika tidak ingin mengganti password' : 'Minimal 8 karakter'}
                                />
                                <Select label="Role" value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} error={form.errors.role}>
                                    {roles.map((role) => (
                                        <option key={role.slug} value={role.slug}>{role.name}</option>
                                    ))}
                                </Select>
                                <Button type="submit" disabled={form.processing} className="w-100">
                                    {editingUser ? 'Update' : 'Simpan'}
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
                                                        onClick={() => startEdit(user)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        className="btn-sm"
                                                        onClick={() => {
                                                            if (!window.confirm(`Hapus user "${user.name}"?`)) {
                                                                return;
                                                            }

                                                            router.delete(`/super-admin/users/${user.id}`, { preserveScroll: true });
                                                        }}
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
                </Col>
            </Row>
        </SuperAdminLayout>
    );
}
