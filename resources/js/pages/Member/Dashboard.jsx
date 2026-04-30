import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Row, Col } from '@themesberg/react-bootstrap';
import MemberLayout from '../../Layouts/MemberLayout';
import StatCard from '../../Components/StatCard';
import Badge from '../../Components/Badge';
import { formatDate } from '../../lib/format';

export default function Dashboard({ stats, activeBorrowings, notifications, recommendedBooks }) {
    return (
        <MemberLayout
            title="Member Dashboard"
            subtitle="Pantau pinjaman aktif, notifikasi jatuh tempo, dan koleksi rekomendasi."
        >
            <Head title="Member Dashboard" />

            <Row className="g-4">
                <Col md={6} xl={3}>
                    <StatCard label="Pinjaman Aktif" value={stats.activeBorrowings} icon="bi-arrow-repeat" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard label="Riwayat" value={stats.historyCount} icon="bi-clock-history" variant="info" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard label="Reservasi" value={stats.reservations} icon="bi-bookmark" variant="warning" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard label="Buku Tersedia" value={stats.availableBooks} icon="bi-book" variant="success" />
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col xl={7}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-1">Pinjaman Aktif</h5>
                            <p className="mb-0 text-muted">Daftar pinjaman yang sedang berjalan.</p>
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
                                                    {item.is_overdue ? 'Overdue' : 'Borrowed'}
                                                </Badge>
                                            </div>
                                            <Row className="g-2 mt-3 small text-muted">
                                                <Col sm={4}>Pinjam: {formatDate(item.borrow_date)}</Col>
                                                <Col sm={4}>Tempo: {formatDate(item.due_date)}</Col>
                                                <Col sm={4}>Denda: Rp{Number(item.fine_amount || 0).toLocaleString('id-ID')}</Col>
                                            </Row>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted">Belum ada pinjaman aktif.</div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={5}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-1">Notifikasi Jatuh Tempo</h5>
                            <p className="mb-0 text-muted">Pengingat pinjaman yang perlu segera ditindaklanjuti.</p>
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
                                                {item.isOverdue ? 'Sudah melewati jatuh tempo' : `${item.daysLeft} hari lagi`}
                                            </div>
                                            <div className="small text-muted mt-2">Due date: {item.dueDate}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted">Tidak ada notifikasi jatuh tempo.</div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm mt-4">
                <Card.Header className="bg-white border-bottom d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="mb-1">Rekomendasi Buku</h5>
                        <p className="mb-0 text-muted">Buku yang relevan untuk dipinjam berikutnya.</p>
                    </div>
                    <Link href="/member/catalog" className="btn btn-outline-primary btn-sm">
                        Lihat katalog
                    </Link>
                </Card.Header>
                <Card.Body>
                    <Row className="g-3">
                        {recommendedBooks.map((book) => (
                            <Col key={book.id} md={6} xl={3}>
                                <Link href={`/member/catalog/${book.id}`} className="text-decoration-none">
                                    <div className="rounded-3 border bg-light p-3 h-100">
                                        <div className="small text-primary text-uppercase fw-bold">
                                            {book.category?.name}
                                        </div>
                                        <div className="fw-semibold text-dark mt-2">{book.title}</div>
                                        <div className="small text-muted mt-1">{book.author}</div>
                                        <div className="d-flex align-items-center justify-content-between mt-3 gap-2">
                                            <Badge variant={book.is_available ? 'success' : 'danger'}>
                                                {book.is_available ? 'Available' : 'Empty'}
                                            </Badge>
                                            <span className="small text-muted">Stok {book.stock}</span>
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
