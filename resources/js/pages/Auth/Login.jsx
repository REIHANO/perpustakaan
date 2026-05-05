import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { useI18n } from '../../lib/i18n';

export default function Login({ status }) {
    const form = useForm({
        email: '',
        password: '',
    });
    const { flash = {} } = usePage().props;
    const { t } = useI18n();
    const showForgotPasswordLink = Boolean(flash.showForgotPasswordLink);

    const submit = (e) => {
        e.preventDefault();
        form.post('/login');
    };

    return (
        <AuthLayout
            title={t('auth.login_title', 'Masuk ke sistem')}
            subtitle={t('auth.login_subtitle', 'Kelola peminjaman, reservasi, kategori, buku, dan laporan dalam satu dashboard modern.')}
        >
            <Head title={t('common.login', 'Login')} />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h2 className="h3 mb-2 text-dark">{t('auth.login_heading', 'Login')}</h2>
                    <p className="mb-0 text-muted">{t('auth.login_hint', 'Gunakan akun admin atau member yang sudah terdaftar.')}</p>
                </div>

                {status ? (
                    <div className="alert alert-success mb-0" role="alert">
                        {status}
                    </div>
                ) : null}

                <Input
                    label={t('auth.email', 'Email')}
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    error={form.errors.email}
                    placeholder="admin@perpustakaan.test"
                />

                <Input
                    label={t('auth.password', 'Password')}
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    error={form.errors.password}
                    placeholder="••••••••"
                />

                <Button type="submit" className="w-100" disabled={form.processing}>
                    {form.processing ? 'Memproses...' : t('auth.login_button', 'Masuk')}
                </Button>

                {showForgotPasswordLink ? (
                    <div className="alert alert-warning mb-0" role="alert">
                        <div className="fw-semibold mb-1">{t('auth.too_many_attempts', 'Terlalu banyak percobaan login gagal.')}</div>
                        <div>
                            <Link href="/forgot-password" className="fw-semibold text-decoration-none">
                                {t('auth.forgot_password_link', 'Lupa password? Klik di sini untuk reset password.')}
                            </Link>
                        </div>
                    </div>
                ) : null}

                <p className="text-center text-sm text-muted mb-0">
                    Belum punya akun?{' '}
                    <Link href="/register" className="fw-semibold text-primary">
                        {t('auth.register_link', 'Daftar member')}
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
