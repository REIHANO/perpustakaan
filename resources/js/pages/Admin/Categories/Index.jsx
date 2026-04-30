import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { formatDate, formatNumber } from '../../../lib/format';
import { hasPermission } from '../../../lib/permissions';

export default function Index({ categories }) {
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
            title="Category Management"
            subtitle="Kelola kategori buku dan relasi katalog secara cepat."
        >
            <Head title="Admin Categories" />

            <div className="grid gap-3 xl:grid-cols-[0.5fr_1.15fr]">
                {canManageCategories ? (
                    <Card>
                        <div className="mb-5">
                            <p className="text-sm uppercase tracking-[0.2em] text-muted">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </p>
                            <h2 className="mt-2 h4 mb-0 text-dark">
                                {editingCategory ? 'Ubah kategori' : 'Buat kategori'}
                            </h2>
                        </div>

                        <form onSubmit={submit} className="d-grid gap-3">
                            <Input
                                label="Nama"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                                placeholder="Contoh: Teknologi"
                            />
                            <Input
                                label="Slug"
                                value={form.data.slug}
                                onChange={(e) => form.setData('slug', e.target.value)}
                                error={form.errors.slug}
                                placeholder="opsional, otomatis jika kosong"
                            />

                            <div className="d-flex gap-3">
                                <Button type="submit" disabled={form.processing}>
                                    {editingCategory ? 'Update' : 'Save'}
                                </Button>
                                <Button variant="secondary" onClick={startCreate}>
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : null}

                <Table title="Daftar Kategori" subtitle={`${formatNumber(categories.length)} kategori aktif`}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Nama</th>
                                <th>Slug</th>
                                <th>Buku</th>
                                <th>Dibuat</th>
                                <th>Aksi</th>
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
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        router.delete(`/admin/categories/${category.id}`, {
                                                            preserveScroll: true,
                                                        })
                                                    }
                                                >
                                                    Delete
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
            </div>
        </AdminLayout>
    );
}
