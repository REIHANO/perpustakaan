import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatCard from '../../../Components/StatCard';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import { formatNumber, formatCurrency } from '../../../lib/format';
import { useI18n } from '../../../lib/i18n';

export default function Index({ summary, mostBorrowedBooks, categoryCounts, overdueBorrowings }) {
    const { t } = useI18n();
    return (
        <AdminLayout
            title={t('nav.reports', 'Reports')}
            subtitle={t('reports.subtitle', 'Summary statistics and library conditions.')}
        >
            <Head title={t('nav.reports', 'Reports')} />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label={t('reports.total_borrowings', 'Total Borrowings')} value={summary.totalBorrowings} icon="bi-clipboard-data" />
                <StatCard label={t('states.active', 'Active')} value={summary.activeBorrowings} icon="bi-arrow-repeat" variant="info" />
                <StatCard label={t('states.returned', 'Returned')} value={summary.returnedBorrowings} icon="bi-check2-circle" variant="success" />
                <StatCard label={t('reports.total_fine', 'Total Fine')} value={formatCurrency(summary.totalFine)} icon="bi-cash-coin" variant="warning" />
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
                <Table title={t('reports.popular_books', 'Most Borrowed Books')} subtitle={t('reports.popular_books_subtitle', 'Based on the number of transactions')}>
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-6 py-4">{t('labels.book', 'Book')}</th>
                                <th className="px-6 py-4">{t('labels.borrowings', 'Borrowings')}</th>
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

                <Table title={t('reports.category_distribution', 'Book Categories')} subtitle={t('reports.category_distribution_subtitle', 'Collection distribution')}>
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-6 py-4">{t('labels.category', 'Category')}</th>
                                <th className="px-6 py-4">{t('reports.book_total', 'Book Total')}</th>
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
                <Table title={t('reports.overdue_borrowings', 'Overdue Borrowings')} subtitle={t('reports.overdue_borrowings_subtitle', 'Transactions that have passed their due date')}>
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-6 py-4">{t('labels.member', 'Member')}</th>
                                <th className="px-6 py-4">{t('labels.book', 'Book')}</th>
                                <th className="px-6 py-4">{t('labels.status', 'Status')}</th>
                                <th className="px-6 py-4">{t('labels.fine', 'Fine')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {overdueBorrowings.map((borrowing) => (
                                <tr key={borrowing.id} className="text-sm text-slate-300">
                                    <td className="px-6 py-4">{borrowing.user?.name}</td>
                                    <td className="px-6 py-4">{borrowing.book?.title}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="danger">{t('states.overdue', 'Overdue')}</Badge>
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
