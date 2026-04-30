import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import Badge from '../../../Components/Badge';
import { formatDate } from '../../../lib/format';

export default function Show({ book, activeBorrowing, relatedBooks }) {
    const borrowForm = useForm({ book_id: book.id });
    const reserveForm = useForm({ book_id: book.id });

    const borrow = () => {
        borrowForm.post('/member/borrowings', {
            preserveScroll: true,
        });
    };

    const reserve = () => {
        reserveForm.post('/member/reservations', {
            preserveScroll: true,
        });
    };

    return (
        <MemberLayout
            title={book.title}
            subtitle="Detail buku, status ketersediaan, dan aksi peminjaman/reservasi."
        >
            <Head title={book.title} />

            <div className="row g-4">
                <div className="col-xl-8">
                    <Card>
                        <div className="p-4 rounded-4" style={{ background: 'linear-gradient(180deg, rgba(37,99,235,0.08) 0%, rgba(255,255,255,1) 100%)' }}>
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <img
                                        src={book.cover_url || 'https://placehold.co/400x600?text=No+Cover'}
                                        alt={book.title}
                                        className="img-fluid rounded-4 shadow-sm w-100"
                                        style={{ objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/400x600?text=No+Cover';
                                        }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
                                        <div>
                                            <p className="small text-primary text-uppercase fw-bold mb-1">
                                                {book.category?.name || 'Uncategorized'}
                                            </p>
                                            <h1 className="h3 mb-2 text-dark">{book.title}</h1>
                                            <p className="lead text-muted mb-0">{book.author}</p>
                                        </div>
                                        <Badge variant={book.is_available ? 'success' : 'danger'}>
                                            {book.is_available ? 'Available' : 'Not available'}
                                        </Badge>
                                    </div>

                                    <div className="row g-3 mt-3">
                                        <div className="col-sm-6">
                                            <div className="rounded-3 border bg-white p-3 shadow-sm">
                                                <div className="small text-muted">ISBN</div>
                                                <div className="fw-semibold text-dark">{book.isbn}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="rounded-3 border bg-white p-3 shadow-sm">
                                                <div className="small text-muted">Stok Tersedia</div>
                                                <div className="fw-semibold text-dark">{book.stock}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {activeBorrowing ? (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 mt-3 mb-0">
                                            <i className="bi bi-info-circle fs-4" />
                                            <div>
                                                <div className="fw-semibold">Anda sedang meminjam buku ini</div>
                                                <div className="small">
                                                    Status: <span className="text-capitalize">{activeBorrowing.status}</span> | Jatuh tempo:{' '}
                                                    {formatDate(activeBorrowing.due_date)}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="d-flex flex-wrap gap-2 mt-4">
                                        <Button disabled={!book.is_available || borrowForm.processing} onClick={borrow}>
                                            Pinjam Buku
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            disabled={!book.is_available || reserveForm.processing}
                                            onClick={reserve}
                                        >
                                            Reservasi
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-xl-4">
                    <Card>
                        <h2 className="h5 mb-1 text-dark">Related Books</h2>
                        <p className="text-muted mb-3">Rekomendasi dari kategori yang sama.</p>

                        <div className="d-grid gap-3">
                            {relatedBooks.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/member/catalog/${item.id}`}
                                    className="text-decoration-none"
                                >
                                    <div className="rounded-3 border bg-white p-3 shadow-sm">
                                        <div className="d-flex gap-3">
                                            <img
                                                src={item.cover_url || 'https://placehold.co/160x220?text=No+Cover'}
                                                alt={item.title}
                                                width="56"
                                                height="80"
                                                className="rounded"
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://placehold.co/160x220?text=No+Cover';
                                                }}
                                            />
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold text-dark">{item.title}</div>
                                                <div className="small text-muted">{item.author}</div>
                                                <div className="mt-2">
                                                    <Badge variant={item.is_available ? 'success' : 'danger'}>
                                                        {item.is_available ? 'Available' : 'Empty'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {!relatedBooks.length ? (
                                <div className="text-muted small">Belum ada buku terkait.</div>
                            ) : null}
                        </div>
                    </Card>
                </div>
            </div>
        </MemberLayout>
    );
}
