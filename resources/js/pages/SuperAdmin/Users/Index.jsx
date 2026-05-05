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
import { useI18n } from '../../../lib/i18n';

export default function Index({ users, roles }) {
    const { auth } = usePage().props;
    const { t } = useI18n();
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
        <SuperAdminLayout title={t('nav.users', 'Users')}>
            <Head title={t('nav.users', 'Users')} />

            <Row className="g-4">
                {canManageUsers ? (
                    <Col xl={4}>
                        <FormCard
                            title={editingUser ? t('common.edit', 'Edit') : t('actions.add', 'Add')}
                            subtitle={editingUser ? t('users.edit_subtitle', 'Select a user from the table and update it here.') : t('users.create_subtitle', 'Create a new user and choose an initial role.')}
                            action={editingUser ? (
                                <Button variant="secondary" className="btn-sm" onClick={resetForm}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                            ) : null}
                        >
                            <form onSubmit={submit} className="d-grid gap-3">
                                <Input label={t('labels.name', 'Name')} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} error={form.errors.name} />
                                <Input label={t('labels.email', 'Email')} type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} error={form.errors.email} />
                                <Input
                                    label={editingUser ? t('auth.password_new', 'New password') : t('auth.password', 'Password')}
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    error={form.errors.password}
                                    placeholder={editingUser ? t('users.password_optional', 'Leave blank if you do not want to change the password') : t('users.password_min', 'Minimum 8 characters')}
                                />
                                <Select label={t('labels.role', 'Role')} value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} error={form.errors.role}>
                                    {roles.map((role) => (
                                        <option key={role.slug} value={role.slug}>{role.name}</option>
                                    ))}
                                </Select>
                                <Button type="submit" disabled={form.processing} className="w-100">
                                    {editingUser ? t('common.update', 'Update') : t('common.save', 'Save')}
                                </Button>
                            </form>
                        </FormCard>
                    </Col>
                ) : null}

                <Col xl={canManageUsers ? 8 : 12}>
                    <Table title={t('nav.users', 'Users')} subtitle={t('users.subtitle', 'Edit roles, change passwords, or remove users')}>
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>{t('labels.name', 'Name')}</th>
                                    <th>{t('labels.email', 'Email')}</th>
                                    <th>{t('labels.role', 'Role')}</th>
                                    <th>{t('labels.action', 'Action')}</th>
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
                                                        {t('common.edit', 'Edit')}
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
                                                        {t('common.delete', 'Delete')}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-muted small">{t('states.no_access', 'No access')}</span>
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
