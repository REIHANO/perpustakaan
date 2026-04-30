import React from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import Button from '../../../Components/Button';
import { formatDate, formatCurrency } from '../../../lib/format';

export default function Index({ borrowings }) {
    return (
        <MemberLayout
            title="Borrowing History"
            subtitle="Riwayat peminjaman aktif, selesai, dan denda yang tercatat."
        >
            <Head title="Borrowing History" />

            <Table title="Daftar Peminjaman" subtitle="Semua transaksi milik akun aktif">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                            <th className="px-6 py-4">Buku</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Pinjam</th>
                            <th className="px-6 py-4">Tempo</th>
                            <th className="px-6 py-4">Denda</th>
                            <th className="px-6 py-4" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {borrowings.map((item) => (
                            <tr key={item.id} className="text-sm text-slate-300">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{item.book?.title}</div>
                                    <div className="text-xs text-slate-500">{item.book?.category?.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={
                                            item.status === 'returned'
                                                ? 'success'
                                                : item.status === 'overdue'
                                                    ? 'danger'
                                                    : item.status === 'reserved'
                                                        ? 'info'
                                                        : 'warning'
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">{formatDate(item.borrow_date)}</td>
                                <td className="px-6 py-4">{formatDate(item.due_date)}</td>
                                <td className="px-6 py-4">{formatCurrency(item.fine_amount)}</td>
                                <td className="px-6 py-4">
                                    {(item.status === 'borrowed' || item.status === 'overdue') ? (
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                router.patch(
                                                    `/member/borrowings/${item.id}/return`,
                                                    {},
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            Return
                                        </Button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Table>
        </MemberLayout>
    );
}
