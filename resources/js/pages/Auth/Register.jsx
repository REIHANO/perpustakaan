import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { useI18n } from '../../lib/i18n';

export default function Register() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/register');
    };
    const { t } = useI18n();

    return (
        <AuthLayout
            title={t('auth.register_title', 'Gabung sebagai member')}
            subtitle={t('auth.register_subtitle', 'Akses katalog buku, riwayat peminjaman, reservasi, dan profil dalam antarmuka SPA yang ringan.')}
        >
            <Head title={t('common.register', 'Register')} />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h2 className="h3 mb-2 text-dark">{t('auth.register_heading', 'Register')}</h2>
                    <p className="mb-0 text-muted">{t('auth.register_hint', 'Akun baru otomatis dibuat sebagai member.')}</p>
                </div>

                <Input
                    label={t('auth.name', 'Nama')}
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    error={form.errors.name}
                    placeholder="Nama lengkap"
                />

                <Input
                    label={t('auth.email', 'Email')}
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    error={form.errors.email}
                    placeholder="member@perpustakaan.test"
                />

                <Input
                    label={t('auth.password', 'Password')}
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    error={form.errors.password}
                    placeholder="Minimal 8 karakter"
                />

                <Input
                    label={t('auth.password_confirm', 'Konfirmasi Password')}
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                    error={form.errors.password_confirmation}
                    placeholder="Ulangi password"
                />

                <Button type="submit" className="w-100" disabled={form.processing}>
                    {form.processing ? 'Mendaftar...' : t('auth.register_button', 'Daftar')}
                </Button>

                <p className="text-center text-sm text-muted mb-0">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="fw-semibold text-primary">
                        {t('auth.login_link', 'Login')}
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
