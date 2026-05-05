import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Row, Col } from '@themesberg/react-bootstrap';
import MemberLayout from '../../Layouts/MemberLayout';
import StatCard from '../../Components/StatCard';
import Badge from '../../Components/Badge';
import { formatDate } from '../../lib/format';
import { useI18n } from '../../lib/i18n';

export default function Dashboard({ stats, activeBorrowings, notifications, recommendedBooks }) {
    const { t } = useI18n();
    const currency = (value) => `Rp${parseFloat(value || 0).toLocaleString('id-ID')}`;

    return (
        <MemberLayout
            title={t('dashboard.member', 'Member Dashboard')}
            subtitle={t('dashboard.member_subtitle', 'Track active borrowings, due notices, and recommended books.')}
        >
            <Head title={t('dashboard.member', 'Member Dashboard')} />

            <Row className="g-4">
                <Col md={6} xl={3}>
                    <StatCard label={t('dashboard.member_active_borrowings', 'Active Borrowings')} value={stats.activeBorrowings} icon="bi-arrow-repeat" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard label={t('dashboard.member_history', 'History')} value={stats.historyCount} icon="bi-clock-history" variant="info" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard label={t('dashboard.member_reservations', 'Reservations')} value={stats.reservations} icon="bi-bookmark" variant="warning" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard label={t('dashboard.member_available_books', 'Available Books')} value={stats.availableBooks} icon="bi-book" variant="success" />
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col xl={7}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-1">{t('dashboard.member_active_borrowings', 'Active Borrowings')}</h5>
                            <p className="mb-0 text-muted">{t('dashboard.active_borrowings_description', 'A list of currently ongoing borrowings.')}</p>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-3">
                                {activeBorrowings.length ? (
                                    activeBorrowings.map((item) => (
                                        <div key={item.id} className="rounded-3 border bg-light p-3">
                                        <div className="d-flex align-items-start justify-content-between gap-3">
                                            <div>
                                                <div className="fw-semibold text-dark">{item.book?.title}</div>
                                                <div className="small text-muted">{item.book?.category?.name}</div>
                                            </div>
                                            <Badge variant={item.is_overdue ? 'danger' : 'warning'}>
                                                {item.is_overdue ? t('states.overdue', 'Overdue') : t('states.borrowed', 'Borrowed')}
                                            </Badge>
                                        </div>
                                        <Row className="g-2 mt-3 small text-muted">
                                            <Col sm={4}>{t('labels.borrow_date', 'Borrow Date')}: {formatDate(item.borrow_date)}</Col>
                                            <Col sm={4}>{t('labels.due_date', 'Due Date')}: {formatDate(item.due_date)}</Col>
                                            <Col sm={4}>{t('labels.fine', 'Fine')}: {currency(item.fine_amount)}</Col>
                                        </Row>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted">{t('dashboard.no_active_borrowings', 'No active borrowings yet.')}</div>
                            )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={5}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-1">{t('dashboard.due_notifications', 'Due Date Notifications')}</h5>
                            <p className="mb-0 text-muted">{t('dashboard.due_notifications_description', 'Reminders for borrowings that need attention soon.')}</p>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-3">
                                {notifications.length ? (
                                    notifications.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`rounded-3 border p-3 ${
                                                item.isOverdue ? 'border-danger bg-danger-subtle' : 'border-warning bg-warning-subtle'
                                            }`}
                                        >
                                            <div className="fw-semibold text-dark">{item.title}</div>
                                            <div className="small text-muted mt-1">
                                                {item.isOverdue ? t('states.overdue', 'Overdue') : t('dashboard.due_in_days', ':days days left').replace(':days', item.daysLeft)}
                                            </div>
                                            <div className="small text-muted mt-2">{t('labels.due_date', 'Due Date')}: {item.dueDate}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted">{t('dashboard.no_due_notifications', 'No due date notifications.')}</div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

                <Card className="border-0 shadow-sm mt-4">
                <Card.Header className="bg-white border-bottom d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="mb-1">{t('dashboard.recommended_books', 'Recommended Books')}</h5>
                        <p className="mb-0 text-muted">{t('dashboard.recommended_books_description', 'Books relevant for your next borrow.')}</p>
                    </div>
                    <Link href="/member/catalog" className="btn btn-outline-primary btn-sm">
                        {t('dashboard.view_catalog', 'View catalog')}
                    </Link>
                </Card.Header>
                <Card.Body>
                    <Row className="g-3">
                        {recommendedBooks.map((book) => (
                            <Col key={book.id} md={6} xl={3}>
                                <Link href={`/member/catalog/${book.id}`} className="text-decoration-none">
                                    <div className="rounded-3 border bg-light p-3 h-100">
                                        <div className="small text-primary text-uppercase fw-bold">
                                            {book.category?.name || t('labels.category', 'Category')}
                                        </div>
                                        <div className="fw-semibold text-dark mt-2">{book.title}</div>
                                        <div className="small text-muted mt-1">{book.author}</div>
                                        <div className="d-flex align-items-center justify-content-between mt-3 gap-2">
                                            <Badge variant={book.is_available ? 'success' : 'danger'}>
                                                {book.is_available ? t('states.available', 'Available') : t('states.empty', 'Empty')}
                                            </Badge>
                                            <span className="small text-muted">{t('labels.stock', 'Stock')} {book.stock}</span>
                                        </div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        </MemberLayout>
    );
}
