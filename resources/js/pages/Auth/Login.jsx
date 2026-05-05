import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

export default function Login({ status }) {
    const form = useForm({
        email: '',
        password: '',
    });
    const { flash = {} } = usePage().props;
    const showForgotPasswordLink = Boolean(flash.showForgotPasswordLink);

    const submit = (e) => {
        e.preventDefault();
        form.post('/login');
    };

    return (
        <AuthLayout
            title="Masuk ke sistem"
            subtitle="Kelola peminjaman, reservasi, kategori, buku, dan laporan dalam satu dashboard modern."
        >
            <Head title="Login" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h2 className="h3 mb-2 text-dark">Login</h2>
                    <p className="mb-0 text-muted">Gunakan akun admin atau member yang sudah terdaftar.</p>
                </div>

                {status ? (
                    <div className="alert alert-success mb-0" role="alert">
                        {status}
                    </div>
                ) : null}

                <Input
                    label="Email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    error={form.errors.email}
                    placeholder="admin@perpustakaan.test"
                />

                <Input
                    label="Password"
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    error={form.errors.password}
                    placeholder="••••••••"
                />

                <Button type="submit" className="w-100" disabled={form.processing}>
                    {form.processing ? 'Memproses...' : 'Masuk'}
                </Button>

                {showForgotPasswordLink ? (
                    <div className="alert alert-warning mb-0" role="alert">
                        <div className="fw-semibold mb-1">Terlalu banyak percobaan login gagal.</div>
                        <div>
                            <Link href="/forgot-password" className="fw-semibold text-decoration-none">
                                Lupa password? Klik di sini untuk reset password.
                            </Link>
                        </div>
                    </div>
                ) : null}

                <p className="text-center text-sm text-muted mb-0">
                    Belum punya akun?{' '}
                    <Link href="/register" className="fw-semibold text-primary">
                        Daftar member
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
