import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Card from '../../../Components/Card';
import Input from '../../../Components/Input';
import Select from '../../../Components/Select';
import Badge from '../../../Components/Badge';

export default function Index({ books, categories }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const matchesSearch =
                !search ||
                [book.title, book.author, book.isbn, book.category?.name]
                    .join(' ')
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory = !category || String(book.category_id) === String(category);

            return matchesSearch && matchesCategory;
        });
    }, [books, search, category]);

    return (
        <MemberLayout
            title="Book Catalog"
            subtitle="Cari buku secara realtime, filter kategori, dan cek status ketersediaan."
        >
            <Head title="Book Catalog" />

            <div
                className="rounded-4 border-0 shadow-sm overflow-hidden mb-4"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #2563eb 100%)' }}
            >
                <div className="p-4 p-md-5 text-white">
                    <div className="row g-4 align-items-end">
                        <div className="col-lg-7">
                            <span className="badge bg-white text-primary mb-3">Member Catalog</span>
                            <h1 className="display-6 fw-bold mb-2">Temukan buku dengan tampilan yang lebih bersih dan cepat.</h1>
                            <p className="mb-0 text-white-50">
                                Gunakan pencarian realtime, filter kategori, dan status stok untuk memilih buku yang tersedia.
                            </p>
                        </div>
                        <div className="col-lg-5">
                            <div className="row g-3">
                                <div className="col-12 col-sm-7">
                                    <Input
                                        label="Search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Judul, penulis, ISBN..."
                                    />
                                </div>
                                <div className="col-12 col-sm-5">
                                    <Select label="Kategori" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="">Semua kategori</option>
                                        {categories.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-12">
                                    <div className="rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 p-3 d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="small text-white-50">Hasil ditampilkan</div>
                                            <div className="h3 mb-0 text-white">{filteredBooks.length}</div>
                                        </div>
                                        <i className="bi bi-journal-bookmark fs-1 text-white-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {filteredBooks.map((book) => (
                    <div className="col-md-6 col-xl-4" key={book.id}>
                        <Link href={`/member/catalog/${book.id}`} className="text-decoration-none d-block h-100">
                            <Card className="h-100 overflow-hidden">
                                <div className="p-3 border-bottom" style={{ background: 'linear-gradient(180deg, rgba(37,99,235,0.08) 0%, rgba(255,255,255,1) 100%)' }}>
                                    <div className="d-flex gap-3">
                                        <img
                                            src={book.cover_url || 'https://placehold.co/400x600?text=No+Cover'}
                                            alt={book.title}
                                            width="84"
                                            height="112"
                                            className="rounded-3 flex-shrink-0 shadow-sm"
                                            style={{ objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://placehold.co/400x600?text=No+Cover';
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <p className="small text-primary text-uppercase fw-bold mb-1">
                                                {book.category?.name || 'Uncategorized'}
                                            </p>
                                            <h3 className="h6 mb-1 text-dark">{book.title}</h3>
                                            <p className="small text-muted mb-3">{book.author}</p>
                                            <Badge variant={book.is_available ? 'success' : 'danger'}>
                                                {book.is_available ? 'Available' : 'Out of stock'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between p-3 small text-muted">
                                    <span>ISBN {book.isbn}</span>
                                    <span className="fw-semibold text-dark">Stok {book.stock}</span>
                                </div>
                            </Card>
                        </Link>
                    </div>
                ))}

                {!filteredBooks.length ? (
                    <div className="col-12">
                        <Card>
                            <div className="text-center py-5">
                                <i className="bi bi-search fs-1 text-muted d-block mb-3" />
                                <h3 className="h5 text-dark mb-2">Buku tidak ditemukan</h3>
                                <p className="text-muted mb-0">Coba ubah kata kunci atau filter kategori.</p>
                            </div>
                        </Card>
                    </div>
                ) : null}
            </div>
        </MemberLayout>
    );
}
