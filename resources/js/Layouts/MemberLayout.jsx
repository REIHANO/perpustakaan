import React from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';

const navigation = [
    { label: 'Dashboard', href: '/member/dashboard', icon: 'bi-speedometer2' },
    { label: 'Catalog', href: '/member/catalog', icon: 'bi-book' },
    { label: 'Borrowing History', href: '/member/history', icon: 'bi-clock-history' },
    { label: 'Reservations', href: '/member/reservations', icon: 'bi-bookmark' },
    { label: 'Profile', href: '/member/profile', icon: 'bi-person' },
];

export default function MemberLayout({ title, children }) {
    return (
        <AuthenticatedLayout title={title} navigation={navigation}>
            {children}
        </AuthenticatedLayout>
    );
}
