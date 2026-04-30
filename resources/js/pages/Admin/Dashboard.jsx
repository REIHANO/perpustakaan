import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Row, Col } from '@themesberg/react-bootstrap';
import AdminLayout from '../../Layouts/AdminLayout';
import StatCard from '../../Components/StatCard';
import Table from '../../Components/Table';
import Badge from '../../Components/Badge';
import { formatDate } from '../../lib/format';

export default function Dashboard({ stats, recentBorrowings, lowStockBooks }) {
    return (
        <AdminLayout
            title="Dashboard Admin"
            subtitle="Pantau kondisi perpustakaan, stok buku, dan transaksi aktif secara ringkas."
        >
            <Head title="Admin Dashboard" />

            <Row className="g-4">
                <Col md={6} xl={4}>
                    <StatCard label="Total Buku" value={stats.books} icon="bi-book" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Kategori" value={stats.categories} icon="bi-tags" variant="info" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Member" value={stats.members} icon="bi-people" variant="warning" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Peminjaman Aktif" value={stats.activeBorrowings} icon="bi-arrow-repeat" variant="primary" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Overdue" value={stats.overdue} icon="bi-exclamation-triangle" variant="danger" />
                </Col>
                <Col md={6} xl={4}>
                    <StatCard label="Total Peminjaman" value={stats.borrowings} icon="bi-clipboard-data" />
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col xl={8}>
                    <Table title="Peminjaman Terbaru" subtitle="Aktivitas terakhir dari sistem">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Member</th>
                                    <th>Buku</th>
                                    <th>Status</th>
                                    <th>Tanggal</th>
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
                                                {item.status}
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
                            <h5 className="mb-1">Stok Menipis</h5>
                            <p className="mb-0 text-muted">Buku yang harus dipantau</p>
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
                                                        {book.is_available ? 'Available' : 'Out of stock'}
                                                    </Badge>
                                                    <span className="small text-muted">Sisa {book.stock}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted">Tidak ada buku dengan stok menipis.</div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm mt-4">
                        <Card.Body className="p-4">
                            <h5 className="mb-2">Akses Cepat</h5>
                            <p className="text-muted mb-4">Langsung ke modul admin yang paling sering dipakai.</p>
                            <div className="d-grid gap-2">
                                <Link className="btn btn-primary" href="/admin/books">
                                    Kelola Buku
                                </Link>
                                <Link className="btn btn-outline-primary" href="/admin/circulation">
                                    Peminjaman
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}
