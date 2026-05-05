import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

export default function ForgotPassword({ status }) {
    const form = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/forgot-password');
    };

    return (
        <AuthLayout
            title="Lupa password"
            subtitle="Masukkan email akunmu. Kami akan kirim tautan untuk membuat password baru."
        >
            <Head title="Forgot Password" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h2 className="h3 mb-2 text-dark">Reset password</h2>
                    <p className="mb-0 text-muted">Tautan reset akan dikirim ke email yang terdaftar.</p>
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
                    placeholder="member@perpustakaan.test"
                />

                <Button type="submit" className="w-100" disabled={form.processing}>
                    {form.processing ? 'Mengirim...' : 'Kirim tautan reset'}
                </Button>

                <p className="text-center text-sm text-muted mb-0">
                    Kembali ke halaman{' '}
                    <Link href="/login" className="fw-semibold text-primary">
                        login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
