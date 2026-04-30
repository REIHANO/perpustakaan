import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatCard from '../../../Components/StatCard';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { formatNumber, formatCurrency } from '../../../lib/format';

export default function Index({ summary, mostBorrowedBooks, categoryCounts, overdueBorrowings }) {
    return (
        <AdminLayout
            title="Reports"
            subtitle="Ringkasan statistik dan kondisi perpustakaan."
        >
            <Head title="Admin Reports" />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Peminjaman" value={summary.totalBorrowings} icon="bi-clipboard-data" />
                <StatCard label="Aktif" value={summary.activeBorrowings} icon="bi-arrow-repeat" variant="info" />
                <StatCard label="Returned" value={summary.returnedBorrowings} icon="bi-check2-circle" variant="success" />
                <StatCard label="Total Denda" value={formatCurrency(summary.totalFine)} icon="bi-cash-coin" variant="warning" />
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
                <Table title="Buku Terpopuler" subtitle="Berdasarkan jumlah transaksi">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-6 py-4">Buku</th>
                                <th className="px-6 py-4">Peminjaman</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {mostBorrowedBooks.map((book) => (
                                <tr key={book.id} className="text-sm text-slate-300">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-600">{book.title}</div>
                                        <div className="text-xs text-slate-500">{book.category?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="primary">{book.borrowings_count}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Table>

                <Table title="Kategori Buku" subtitle="Distribusi koleksi">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Jumlah Buku</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {categoryCounts.map((category) => (
                                <tr key={category.id} className="text-sm text-slate-300">
                                    <td className="px-6 py-4 font-medium text-slate-600">{category.name}</td>
                                    <td className="px-6 py-4">{category.books_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Table>
            </div>

            <div className="mt-6">
                <Table title="Overdue Borrowings" subtitle="Transaksi yang melewati batas pinjam">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Buku</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Denda</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {overdueBorrowings.map((borrowing) => (
                                <tr key={borrowing.id} className="text-sm text-slate-300">
                                    <td className="px-6 py-4">{borrowing.user?.name}</td>
                                    <td className="px-6 py-4">{borrowing.book?.title}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="danger">{borrowing.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4">{formatCurrency(borrowing.fine_amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Table>
            </div>
        </AdminLayout>
    );
}
