import React from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import Button from '../../../Components/Button';
import { formatDate } from '../../../lib/format';
import { useI18n } from '../../../lib/i18n';

export default function Index({ reservations }) {
    const { t } = useI18n();

    return (
        <MemberLayout
            title={t('nav.reservations', 'Reservations')}
            subtitle={t('reservations.subtitle', 'Book reservations that have not been converted to borrowings yet.')}
        >
            <Head title={t('nav.reservations', 'Reservations')} />

            <Table title={t('reservations.active', 'Active Reservations')} subtitle={t('reservations.subtitle_2', 'Bookings waiting to be borrowed')}>
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                            <th className="px-6 py-4">{t('labels.book', 'Book')}</th>
                            <th className="px-6 py-4">{t('labels.status', 'Status')}</th>
                            <th className="px-6 py-4">{t('labels.date', 'Date')}</th>
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
                                    <Badge variant="info">{t(`states.${item.status}`, item.status)}</Badge>
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
                                        {t('actions.convert', 'Convert')}
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
