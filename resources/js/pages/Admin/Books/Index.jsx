import React, { useEffect, useMemo, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';
import Select from '../../../Components/Select';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { formatDate, formatNumber } from '../../../lib/format';
import { hasPermission } from '../../../lib/permissions';

export default function Index({ books, categories }) {
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    const canManageBooks = hasPermission(permissions, 'manage-books');

    const [editingBook, setEditingBook] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);

    const form = useForm({
        category_id: categories[0]?.id || '',
        title: '',
        author: '',
        isbn: '',
        stock: 0,
        cover: null,
    });

    const categoryOptions = useMemo(() => categories ?? [], [categories]);

    useEffect(() => {
        if (!form.data.category_id && categoryOptions[0]?.id) {
            form.setData('category_id', categoryOptions[0].id);
        }
    }, [categoryOptions, form]);

    useEffect(() => {
        return () => {
            if (coverPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(coverPreview);
            }
        };
    }, [coverPreview]);

    const resetForm = () => {
        setEditingBook(null);
        setCoverPreview(null);
        setFileInputKey((value) => value + 1);
        form.reset();
        form.clearErrors();

        if (categoryOptions[0]?.id) {
            form.setData('category_id', categoryOptions[0].id);
        }
    };

    const startEdit = (book) => {
        setEditingBook(book);
        setCoverPreview(book.cover_url || null);
        form.setData({
            category_id: book.category_id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            stock: book.stock,
            cover: null,
        });
    };

    const handleCoverChange = (event) => {
        const file = event.target.files?.[0] || null;

        if (coverPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }

        form.setData('cover', file);
        setCoverPreview(file ? URL.createObjectURL(file) : editingBook?.cover_url || null);
    };

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            category_id: form.data.category_id,
            title: form.data.title,
            author: form.data.author,
            isbn: form.data.isbn,
            stock: form.data.stock,
            cover: form.data.cover,
        };

        if (editingBook) {
            router.post(`/admin/books/${editingBook.id}`, {
                _method: 'put',
                ...payload,
            }, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: resetForm,
            });
            return;
        }

        form.post('/admin/books', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: resetForm,
        });
    };

    return (
        <AdminLayout
            title="Book Management"
            subtitle="CRUD buku terhubung ke kategori, stok, dan cover."
        >
            <Head title="Admin Books" />

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                {canManageBooks ? (
                    <Card>
                        <div className="mb-5">
                            <p className="text-sm uppercase tracking-[0.2em] text-muted">
                                {editingBook ? 'Edit Book' : 'New Book'}
                            </p>
                            <h2 className="mt-2 h4 mb-0 text-dark">
                                {editingBook ? 'Ubah buku' : 'Tambah buku'}
                            </h2>
                        </div>

                        <form onSubmit={submit} className="d-grid gap-3">
                            <Select
                                label="Kategori"
                                value={form.data.category_id}
                                onChange={(e) => form.setData('category_id', e.target.value)}
                                error={form.errors.category_id}
                            >
                                <option value="">Pilih kategori</option>
                                {categoryOptions.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>

                            <Input
                                label="Judul"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                error={form.errors.title}
                                placeholder="Contoh: Laravel untuk Pemula"
                            />

                            <Input
                                label="Penulis"
                                value={form.data.author}
                                onChange={(e) => form.setData('author', e.target.value)}
                                error={form.errors.author}
                            />

                            <Input
                                label="ISBN"
                                value={form.data.isbn}
                                onChange={(e) => form.setData('isbn', e.target.value)}
                                error={form.errors.isbn}
                            />

                            <Input
                                label="Stok"
                                type="number"
                                min="0"
                                value={form.data.stock}
                                onChange={(e) => form.setData('stock', e.target.value)}
                                error={form.errors.stock}
                            />

                            <Input
                                key={fileInputKey}
                                label="Cover buku"
                                type="file"
                                onChange={handleCoverChange}
                                error={form.errors.cover}
                                accept="image/*"
                            />

                            {coverPreview ? (
                                <div className="rounded-3 border bg-light p-3">
                                    <p className="small text-muted mb-2">Preview cover</p>
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '260px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/400x600?text=No+Cover';
                                        }}
                                    />
                                </div>
                            ) : null}

                            <div className="d-flex gap-3">
                                <Button type="submit" disabled={form.processing}>
                                    {editingBook ? 'Update' : 'Save'}
                                </Button>
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : null}

                <Table title="Daftar Buku" subtitle={`${formatNumber(books.length)} buku tersimpan`}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Buku</th>
                                <th>ISBN</th>
                                <th>Stok</th>
                                <th>Kategori</th>
                                <th>Dibuat</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <img
                                                src={book.cover_url || 'https://placehold.co/400x600?text=No+Cover'}
                                                alt={book.title}
                                                className="rounded"
                                                width="48"
                                                height="64"
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://placehold.co/400x600?text=No+Cover';
                                                }}
                                            />
                                            <div>
                                                <div className="fw-semibold text-dark">{book.title}</div>
                                                <div className="small text-muted">{book.author}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{book.isbn}</td>
                                    <td>
                                        <Badge variant={book.stock > 0 ? 'success' : 'danger'}>
                                            {book.stock}
                                        </Badge>
                                    </td>
                                    <td>{book.category?.name}</td>
                                    <td>{formatDate(book.created_at)}</td>
                                    <td>
                                        {canManageBooks ? (
                                            <div className="d-flex gap-2 flex-wrap">
                                                <Button variant="secondary" onClick={() => startEdit(book)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        router.delete(`/admin/books/${book.id}`, { preserveScroll: true })
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
