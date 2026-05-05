import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { useI18n } from '../../lib/i18n';

export default function ResetPassword({ token, email, status }) {
    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const { t } = useI18n();

    const submit = (e) => {
        e.preventDefault();
        form.post('/reset-password');
    };

    return (
        <AuthLayout
            title={t('auth.reset_password_title', 'Buat password baru')}
            subtitle={t('auth.reset_password_subtitle', 'Gunakan tautan reset yang sudah dikirim ke email untuk mengganti password akunmu.')}
        >
            <Head title={t('auth.reset_password_title', 'Reset Password')} />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h2 className="h3 mb-2 text-dark">{t('auth.reset_password_heading', 'Reset password')}</h2>
                    <p className="mb-0 text-muted">{t('auth.reset_password_hint', 'Masukkan password baru untuk akunmu.')}</p>
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
                    placeholder="member@perpustakaan.test"
                />

                <Input
                    label={t('auth.password_new', 'Password baru')}
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    error={form.errors.password}
                    placeholder="Minimal 8 karakter"
                />

                <Input
                    label={t('auth.password_confirm_new', 'Konfirmasi password')}
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                    error={form.errors.password_confirmation}
                    placeholder="Ulangi password baru"
                />

                <Button type="submit" className="w-100" disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : t('auth.reset_password_button', 'Reset password')}
                </Button>

                <p className="text-center text-sm text-muted mb-0">
                    Kembali ke{' '}
                    <Link href="/login" className="fw-semibold text-primary">
                        {t('auth.login_link', 'login')}
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
