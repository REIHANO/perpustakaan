import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import FormCard from '../../../Components/FormCard';
import Select from '../../../Components/Select';
import Table from '../../../Components/Table';
import Badge from '../../../Components/Badge';
import Input from '../../../Components/Input';
import { formatDate } from '../../../lib/format';
import { useI18n } from '../../../lib/i18n';

export default function Index({ members, books, borrowings, canSetFine }) {
    const [fineInputs, setFineInputs] = useState({});
    const { t } = useI18n();

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
            title={t('nav.circulation', 'Circulation')}
            subtitle={t('circulation.subtitle', 'Manage borrowings and returns from the admin side.')}
        >
            <Head title={t('nav.circulation', 'Circulation')} />

            <div className="rounded-4 border bg-white shadow-sm p-4 mb-4">
                <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted mb-2">{t('circulation.overview', 'Circulation Overview')}</p>
                        <h2 className="h4 mb-2 text-dark">{t('circulation.heading', 'Borrowings, returns, and fines')}</h2>
                        <p className="mb-0 text-muted">{t('circulation.description', 'Use this page to process manual transactions from the admin side.')}</p>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <Badge variant="info">{t('nav.circulation', 'Circulation')}</Badge>
                        {canSetFine ? (
                            <Badge variant="success">{t('circulation.set_fine_enabled', 'Set Fine Enabled')}</Badge>
                        ) : (
                            <Badge variant="neutral">{t('circulation.set_fine_disabled', 'Set Fine Disabled')}</Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <FormCard
                    className="h-100"
                    title={t('circulation.manual_loan', 'Manual borrowing')}
                    subtitle={t('circulation.manual_loan_subtitle', 'Process borrowing transactions from admin.')}
                >
                    <form onSubmit={submit} className="d-grid gap-3">
                        <Select
                            label={t('labels.member', 'Member')}
                            value={form.data.user_id}
                            onChange={(e) => form.setData('user_id', e.target.value)}
                            error={form.errors.user_id}
                        >
                            <option value="">{t('circulation.select_member', 'Select member')}</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} - {member.email}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label={t('labels.book', 'Book')}
                            value={form.data.book_id}
                            onChange={(e) => form.setData('book_id', e.target.value)}
                            error={form.errors.book_id}
                        >
                            <option value="">{t('circulation.select_book', 'Select book')}</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title} ({book.category?.name}) - stok {book.stock}
                                </option>
                            ))}
                        </Select>

                        <Button type="submit" disabled={form.processing}>
                            {t('circulation.process_loan', 'Process Borrowing')}
                        </Button>
                    </form>
                </FormCard>

                <Table title={t('circulation.latest_transactions', 'Latest Transactions')} subtitle={t('circulation.latest_transactions_subtitle', 'Borrowings that are ongoing or finished')}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>{t('labels.member', 'Member')}</th>
                                <th>{t('labels.book', 'Book')}</th>
                                <th>{t('labels.status', 'Status')}</th>
                                <th>{t('labels.borrow_date', 'Borrow Date')}</th>
                                <th>{t('labels.due_date', 'Due Date')}</th>
                                {canSetFine ? <th>{t('labels.fine', 'Fine')}</th> : null}
                                <th>{t('labels.action', 'Action')}</th>
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
                                            {t(`states.${borrowing.status}`, borrowing.status)}
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
                                                {canSetFine ? t('circulation.return_with_fine', 'Return + Fine') : t('actions.return', 'Return')}
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
