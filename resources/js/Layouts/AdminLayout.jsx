import React from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';

const navigation = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
    { label: 'Books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { label: 'Categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { label: 'Circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { label: 'Reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
];

export default function AdminLayout({ title, children }) {
    return (
        <AuthenticatedLayout title={title} navigation={navigation}>
            {children}
        </AuthenticatedLayout>
    );
}
