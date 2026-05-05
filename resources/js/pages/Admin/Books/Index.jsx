import React, { useEffect, useMemo, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Select from '../../../Components/Select';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { formatDate, formatNumber } from '../../../lib/format';
import { hasPermission } from '../../../lib/permissions';
import { useI18n } from '../../../lib/i18n';

export default function Index({ books, categories }) {
    const { auth } = usePage().props;
    const { t } = useI18n();
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
            title={t('nav.books', 'Books')}
            subtitle={t('books.subtitle', 'CRUD books connected to categories, stock, and covers.')}
        >
            <Head title={t('nav.books', 'Books')} />

            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr] items-start">
                {canManageBooks ? (
                    <FormCard
                        title={editingBook ? t('common.edit', 'Edit') : t('actions.add', 'Add')}
                        subtitle={t('books.subtitle', 'CRUD books connected to categories, stock, and covers.')}
                    >
                        <form onSubmit={submit} className="d-grid gap-3">
                            <Select
                                label={t('labels.category', 'Category')}
                                value={form.data.category_id}
                                onChange={(e) => form.setData('category_id', e.target.value)}
                                error={form.errors.category_id}
                            >
                                <option value="">{t('books.select_category', 'Select category')}</option>
                                {categoryOptions.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>

                            <Input
                                label={t('labels.title', 'Title')}
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                error={form.errors.title}
                                placeholder={t('books.title_placeholder', 'Example: Laravel for Beginners')}
                            />

                            <Input
                                label={t('labels.author', 'Author')}
                                value={form.data.author}
                                onChange={(e) => form.setData('author', e.target.value)}
                                error={form.errors.author}
                            />

                            <Input
                                label={t('labels.isbn', 'ISBN')}
                                value={form.data.isbn}
                                onChange={(e) => form.setData('isbn', e.target.value)}
                                error={form.errors.isbn}
                            />

                            <Input
                                label={t('labels.stock', 'Stock')}
                                type="number"
                                min="0"
                                value={form.data.stock}
                                onChange={(e) => form.setData('stock', e.target.value)}
                                error={form.errors.stock}
                            />

                            <Input
                                key={fileInputKey}
                                label={t('labels.cover', 'Cover')}
                                type="file"
                                onChange={handleCoverChange}
                                error={form.errors.cover}
                                accept="image/*"
                            />

                            {coverPreview ? (
                                <div className="rounded-3 border bg-light p-3">
                                    <p className="small text-muted mb-2">{t('books.cover_preview', 'Cover preview')}</p>
                                    <img
                                        src={coverPreview}
                                        alt={t('books.cover_preview', 'Cover preview')}
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
                                    {editingBook ? t('common.update', 'Update') : t('common.save', 'Save')}
                                </Button>
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    {t('common.reset', 'Reset')}
                                </Button>
                            </div>
                        </form>
                    </FormCard>
                ) : null}

                <Table title={t('books.list', 'Book List')} subtitle={`${formatNumber(books.length)} ${t('labels.books', 'books')}`}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>{t('labels.book', 'Book')}</th>
                                <th>{t('labels.isbn', 'ISBN')}</th>
                                <th>{t('labels.stock', 'Stock')}</th>
                                <th>{t('labels.category', 'Category')}</th>
                                <th>{t('labels.date', 'Date')}</th>
                                <th>{t('labels.action', 'Action')}</th>
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
                                                    {t('common.edit', 'Edit')}
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        router.delete(`/admin/books/${book.id}`, { preserveScroll: true })
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
