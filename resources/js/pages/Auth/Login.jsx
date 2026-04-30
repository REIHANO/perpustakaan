import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
    });

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
