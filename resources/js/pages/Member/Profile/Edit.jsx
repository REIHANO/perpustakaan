import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Card from '../../../Components/Card';
import FormCard from '../../../Components/FormCard';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import Badge from '../../../Components/Badge';
import { useI18n } from '../../../lib/i18n';

export default function Edit({ user }) {
    const { t } = useI18n();
    const form = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        form.patch('/member/profile', {
            preserveScroll: true,
        });
    };

    return (
        <MemberLayout
            title={t('common.profile', 'Profile')}
            subtitle={t('profile.subtitle', 'Update the member account identity.')}
        >
            <Head title={t('common.profile', 'Profile')} />

            <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}>
                    <div className="p-4 p-lg-5 text-black">
                        <p className="text-xs uppercase tracking-[0.2em] text-black-500 mb-2">{t('labels.account', 'Account')}</p>
                        <h2 className="mt-2 text-2xl fw-bold mb-2">{user.name}</h2>
                        <p className="mt-2 text-sm text-black-500 mb-0">{user.email}</p>
                        <div className="mt-4">
                            <Badge variant="primary">{user.role}</Badge>
                        </div>
                    </div>
                </Card>

                <FormCard title={t('profile.update', 'Update Profile')} subtitle={t('profile.subtitle', 'Update the member account identity.')}>
                    <form onSubmit={submit} className="d-grid gap-3">
                        <Input
                            label={t('labels.name', 'Name')}
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            error={form.errors.name}
                        />
                        <Input
                            label={t('labels.email', 'Email')}
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            error={form.errors.email}
                        />

                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? t('common.processing', 'Processing...') : t('common.save_changes', 'Save changes')}
                        </Button>
                    </form>
                </FormCard>
            </div>
        </MemberLayout>
    );
}
