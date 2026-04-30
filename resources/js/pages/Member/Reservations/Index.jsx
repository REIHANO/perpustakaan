import React from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import Button from '../../../Components/Button';
import { formatDate } from '../../../lib/format';

export default function Index({ reservations }) {
    return (
        <MemberLayout
            title="Reservations"
            subtitle="Daftar booking buku yang belum diubah menjadi peminjaman."
        >
            <Head title="Reservations" />

            <Table title="Reservasi Aktif" subtitle="Booking yang sedang menunggu proses pinjam">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                            <th className="px-6 py-4">Buku</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Dibuat</th>
                            <th className="px-6 py-4" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {reservations.map((item) => (
                            <tr key={item.id} className="text-sm text-slate-300">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{item.book?.title}</div>
                                    <div className="text-xs text-slate-500">{item.book?.category?.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="info">{item.status}</Badge>
                                </td>
                                <td className="px-6 py-4">{formatDate(item.created_at)}</td>
                                <td className="px-6 py-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            router.patch(
                                                `/member/reservations/${item.id}/borrow`,
                                                {},
                                                { preserveScroll: true },
                                            )
                                        }
                                    >
                                        Convert to Borrow
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Table>
        </MemberLayout>
    );
}
