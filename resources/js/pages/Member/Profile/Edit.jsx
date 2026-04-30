import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import Card from '../../../Components/Card';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import Badge from '../../../Components/Badge';

export default function Edit({ user }) {
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
            title="Profile"
            subtitle="Update identitas akun member."
        >
            <Head title="Profile" />

            <div className="grid gap-3 xl:grid-cols-[0.8fr_1.2fr]">
                <Card style={{ backgroundColor: '#1f2937' }} className="border-none">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Account</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-50">{user.name}</h2>
                    <p className="mt-2 text-sm text-slate-400">{user.email}</p>
                    <div className="mt-6">
                        <Badge variant="primary">{user.role}</Badge>
                    </div>
                </Card>

                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <Input
                            label="Nama"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            error={form.errors.name}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            error={form.errors.email}
                        />

                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Card>
            </div>
        </MemberLayout>
    );
}
