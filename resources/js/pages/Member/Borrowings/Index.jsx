import React from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import Button from '../../../Components/Button';
import { formatDate, formatCurrency } from '../../../lib/format';
import { useI18n } from '../../../lib/i18n';

export default function Index({ borrowings }) {
    const { t } = useI18n();

    return (
        <MemberLayout
            title={t('nav.history', 'History')}
            subtitle={t('history.subtitle', 'Active, finished, and recorded fine borrowings.')}
        >
            <Head title={t('nav.history', 'History')} />

            <Table title={t('history.list', 'Borrowing List')} subtitle={t('history.subtitle_2', 'All transactions for the active account')}>
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                            <th className="px-6 py-4">{t('labels.book', 'Book')}</th>
                            <th className="px-6 py-4">{t('labels.status', 'Status')}</th>
                            <th className="px-6 py-4">{t('labels.borrow_date', 'Borrow Date')}</th>
                            <th className="px-6 py-4">{t('labels.due_date', 'Due Date')}</th>
                            <th className="px-6 py-4">{t('labels.fine', 'Fine')}</th>
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
                                        {t(`states.${item.status}`, item.status)}
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
                                            {t('actions.return', 'Return')}
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
