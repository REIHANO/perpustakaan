import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Row, Col } from '@themesberg/react-bootstrap';
import AdminLayout from '../../Layouts/AdminLayout';
import StatCard from '../../Components/StatCard';
import Table from '../../Components/Table';
import Badge from '../../Components/Badge';
import { formatDate } from '../../lib/format';
import { useI18n } from '../../lib/i18n';

export default function Dashboard({ stats, recentBorrowings, lowStockBooks }) {
    const { t } = useI18n();

    return (
        <AdminLayout
            title={t('dashboard.admin', 'Dashboard Admin')}
            subtitle={t('dashboard.admin_subtitle', 'Monitor library conditions, stock, and active transactions at a glance.')}
        >
            <Head title={t('dashboard.admin', 'Admin Dashboard')} />

            <Row className="g-4">
                <Col md={6} xl={4}>
                    <StatCard label={t('labels.books', 'Books')} value={stats.books} icon="bi-book" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label={t('labels.categories', 'Categories')} value={stats.categories} icon="bi-tags" variant="info" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label={t('labels.members', 'Members')} value={stats.members} icon="bi-people" variant="warning" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label={t('dashboard.member_active_borrowings', 'Active Borrowings')} value={stats.activeBorrowings} icon="bi-arrow-repeat" variant="primary" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label={t('states.overdue', 'Overdue')} value={stats.overdue} icon="bi-exclamation-triangle" variant="danger" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label={t('reports.total_borrowings', 'Total Borrowings')} value={stats.borrowings} icon="bi-clipboard-data" />
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col xl={8}>
                    <Table title={t('admin.latest_borrowings', 'Latest Borrowings')} subtitle={t('admin.latest_borrowings_subtitle', 'Latest activity from the system')}>
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>{t('labels.member', 'Member')}</th>
                                    <th>{t('labels.book', 'Book')}</th>
                                    <th>{t('labels.status', 'Status')}</th>
                                    <th>{t('labels.date', 'Date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBorrowings.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.user?.name}</td>
                                        <td>
                                            <div className="fw-semibold text-dark">{item.book?.title}</div>
                                            <div className="small text-muted">{item.book?.category?.name}</div>
                                        </td>
                                        <td>
                                            <Badge
                                                variant={
                                                    item.status === 'returned'
                                                        ? 'success'
                                                        : item.status === 'overdue'
                                                          ? 'danger'
                                                          : 'warning'
                                                }
                                            >
                                                {t(`states.${item.status}`, item.status)}
                                            </Badge>
                                        </td>
                                        <td>{formatDate(item.borrow_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Table>
                </Col>

                <Col xl={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-1">{t('admin.low_stock', 'Low Stock')}</h5>
                            <p className="mb-0 text-muted">{t('admin.low_stock_subtitle', 'Books that should be monitored.')}</p>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3 p-md-4">
                                {lowStockBooks.length ? (
                                    <div className="d-grid gap-3">
                                        {lowStockBooks.map((book) => (
                                            <div key={book.id} className="rounded-3 border bg-light p-3">
                                                <div className="fw-semibold text-dark">{book.title}</div>
                                                <div className="small text-muted">{book.category?.name}</div>
                                                <div className="d-flex align-items-center justify-content-between mt-3 gap-2">
                                                    <Badge variant={book.is_available ? 'success' : 'danger'}>
                                                        {book.is_available ? t('states.available', 'Available') : t('states.out_of_stock', 'Out of stock')}
                                                    </Badge>
                                                    <span className="small text-muted">{t('labels.stock', 'Stock')} {book.stock}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted">{t('admin.no_low_stock', 'No low stock books found.')}</div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm mt-4">
                        <Card.Body className="p-4">
                            <h5 className="mb-2">{t('common.quick_access', 'Quick Access')}</h5>
                            <p className="text-muted mb-4">{t('admin.quick_access_subtitle', 'Jump directly to the most used admin modules.')}</p>
                            <div className="d-grid gap-2">
                                <Link className="btn btn-primary" href="/admin/books">
                                    {t('nav.books', 'Books')}
                                </Link>
                                <Link className="btn btn-outline-primary" href="/admin/circulation">
                                    {t('nav.circulation', 'Circulation')}
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}
