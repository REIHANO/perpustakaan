import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import Select from '../../../Components/Select';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import Input from '../../../Components/Input';
import { formatDate } from '../../../lib/format';

export default function Index({ members, books, borrowings, canSetFine }) {
    const [fineInputs, setFineInputs] = useState({});

    const form = useForm({
        user_id: '',
        book_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/admin/circulation', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const submitReturn = (borrowingId) => {
        const fineAmount = fineInputs[borrowingId];

        router.patch(
            `/admin/circulation/${borrowingId}/return`,
            canSetFine && fineAmount !== undefined && fineAmount !== ''
                ? { fine_amount: fineAmount }
                : {},
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout
            title="Circulation"
            subtitle="Kelola peminjaman dan pengembalian dari sisi admin."
        >
            <Head title="Admin Circulation" />

            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <Badge variant="info">Manage Circulation</Badge>
                {canSetFine ? (
                    <Badge variant="success">Set Fine Enabled</Badge>
                ) : (
                    <Badge variant="neutral">Set Fine Disabled</Badge>
                )}
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <Card>
                    <div className="mb-5">
                        <p className="text-sm uppercase tracking-[0.2em] text-muted">Create Borrowing</p>
                        <h2 className="mt-2 h4 mb-0 text-dark">Peminjaman manual</h2>
                    </div>

                    <form onSubmit={submit} className="d-grid gap-3">
                        <Select
                            label="Member"
                            value={form.data.user_id}
                            onChange={(e) => form.setData('user_id', e.target.value)}
                            error={form.errors.user_id}
                        >
                            <option value="">Pilih member</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} - {member.email}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label="Buku"
                            value={form.data.book_id}
                            onChange={(e) => form.setData('book_id', e.target.value)}
                            error={form.errors.book_id}
                        >
                            <option value="">Pilih buku</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title} ({book.category?.name}) - stok {book.stock}
                                </option>
                            ))}
                        </Select>

                        <Button type="submit" disabled={form.processing}>
                            Proses Peminjaman
                        </Button>
                    </form>
                </Card>

                <Table title="Transaksi Terbaru" subtitle="Peminjaman yang sedang berjalan maupun selesai">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Member</th>
                                <th>Buku</th>
                                <th>Status</th>
                                <th>Pinjam</th>
                                <th>Jatuh Tempo</th>
                                {canSetFine ? <th>Denda Manual</th> : null}
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowings.map((borrowing) => (
                                <tr key={borrowing.id}>
                                    <td>{borrowing.user?.name}</td>
                                    <td>
                                        <div className="fw-semibold text-dark">{borrowing.book?.title}</div>
                                        <div className="small text-muted">{borrowing.book?.category?.name}</div>
                                    </td>
                                    <td>
                                        <Badge
                                            variant={
                                                borrowing.status === 'returned'
                                                    ? 'success'
                                                    : borrowing.status === 'overdue'
                                                        ? 'danger'
                                                        : borrowing.status === 'reserved'
                                                            ? 'info'
                                                            : 'warning'
                                            }
                                        >
                                            {borrowing.status}
                                        </Badge>
                                    </td>
                                    <td>{formatDate(borrowing.borrow_date)}</td>
                                    <td>{formatDate(borrowing.due_date)}</td>
                                    {canSetFine ? (
                                        <td style={{ minWidth: 180 }}>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={fineInputs[borrowing.id] ?? borrowing.fine_amount ?? 0}
                                                onChange={(e) =>
                                                    setFineInputs((current) => ({
                                                        ...current,
                                                        [borrowing.id]: e.target.value,
                                                    }))
                                                }
                                                placeholder="0"
                                            />
                                        </td>
                                    ) : null}
                                    <td>
                                        {(borrowing.status === 'borrowed' || borrowing.status === 'overdue') ? (
                                            <Button
                                                variant="secondary"
                                                onClick={() => submitReturn(borrowing.id)}
                                            >
                                                {canSetFine ? 'Return + Fine' : 'Return'}
                                            </Button>
                                        ) : null}
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
