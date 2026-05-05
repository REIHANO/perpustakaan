import React from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';

const navigation = [
    { labelKey: 'nav.dashboard', href: '/member/dashboard', icon: 'bi-speedometer2' },
    { labelKey: 'nav.catalog', href: '/member/catalog', icon: 'bi-book' },
    { labelKey: 'nav.history', href: '/member/history', icon: 'bi-clock-history' },
    { labelKey: 'nav.reservations', href: '/member/reservations', icon: 'bi-bookmark' },
    { labelKey: 'nav.profile', href: '/member/profile', icon: 'bi-person' },
];

export default function MemberLayout({ title, children }) {
    return (
        <AuthenticatedLayout title={title} navigation={navigation}>
            {children}
        </AuthenticatedLayout>
    );
}
