import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { formatDate, formatNumber } from '../../../lib/format';
import { hasPermission } from '../../../lib/permissions';
import { useI18n } from '../../../lib/i18n';

export default function Index({ categories }) {
    const { t } = useI18n();
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    const canManageCategories = hasPermission(permissions, 'manage-categories');

    const [editingCategory, setEditingCategory] = useState(null);
    const form = useForm({
        name: '',
        slug: '',
    });

    const startCreate = () => {
        setEditingCategory(null);
        form.setData({ name: '', slug: '' });
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        form.setData({ name: category.name, slug: category.slug || '' });
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingCategory) {
            form.put(`/admin/categories/${editingCategory.id}`, {
                preserveScroll: true,
                onSuccess: () => startCreate(),
            });
            return;
        }

        form.post('/admin/categories', {
            preserveScroll: true,
            onSuccess: () => startCreate(),
        });
    };

    return (
        <AdminLayout
            title={t('nav.categories', 'Categories')}
            subtitle={t('categories.subtitle', 'Manage book categories and catalog relationships quickly.')}
        >
            <Head title={t('nav.categories', 'Categories')} />

            <div className="grid gap-3 xl:grid-cols-[0.5fr_1.15fr]">
                {canManageCategories ? (
                    <FormCard
                        title={editingCategory ? t('common.edit', 'Edit') : t('actions.create', 'Create')}
                        subtitle={t('categories.subtitle', 'Manage book categories and catalog relationships quickly.')}
                    >
                        <form onSubmit={submit} className="d-grid gap-3">
                            <Input
                                label={t('labels.name', 'Name')}
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                                placeholder={t('categories.name_placeholder', 'Example: Technology')}
                            />
                            <Input
                                label={t('labels.slug', 'Slug')}
                                value={form.data.slug}
                                onChange={(e) => form.setData('slug', e.target.value)}
                                error={form.errors.slug}
                                placeholder={t('categories.slug_placeholder', 'Optional, auto-generated if empty')}
                            />

                            <div className="d-flex gap-3">
                                <Button type="submit" disabled={form.processing}>
                                    {editingCategory ? t('common.update', 'Update') : t('common.save', 'Save')}
                                </Button>
                                <Button variant="secondary" onClick={startCreate}>
                                    {t('common.reset', 'Reset')}
                                </Button>
                            </div>
                        </form>
                    </FormCard>
                ) : null}

                <Table title={t('categories.list', 'Category List')} subtitle={`${formatNumber(categories.length)} ${t('labels.categories', 'categories')}`}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>{t('labels.name', 'Name')}</th>
                                <th>{t('labels.slug', 'Slug')}</th>
                                <th>{t('labels.books', 'Books')}</th>
                                <th>{t('labels.date', 'Date')}</th>
                                <th>{t('labels.action', 'Action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="fw-semibold text-dark">{category.name}</td>
                                    <td>
                                        <Badge variant="neutral">{category.slug}</Badge>
                                    </td>
                                    <td>{category.books_count}</td>
                                    <td>{formatDate(category.created_at)}</td>
                                    <td>
                                        {canManageCategories ? (
                                            <div className="d-flex gap-2 flex-wrap">
                                                <Button variant="secondary" onClick={() => startEdit(category)}>
                                                    {t('common.edit', 'Edit')}
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        router.delete(`/admin/categories/${category.id}`, {
                                                            preserveScroll: true,
                                                        })
                                                    }
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
            </div>
        </AdminLayout>
    );
}
