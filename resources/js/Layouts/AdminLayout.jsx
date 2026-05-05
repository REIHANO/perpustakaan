import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from './AuthenticatedLayout';

const adminNavigation = [
    { labelKey: 'nav.dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
    { labelKey: 'nav.books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { labelKey: 'nav.categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { labelKey: 'nav.circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { labelKey: 'nav.reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
];

const superAdminNavigation = [
    { labelKey: 'nav.dashboard', href: '/super-admin/dashboard', icon: 'bi-shield-lock' },
    { labelKey: 'nav.users', href: '/super-admin/users', icon: 'bi-people', permission: 'manage-users' },
    { labelKey: 'nav.roles', href: '/super-admin/roles', icon: 'bi-diagram-3', permission: 'manage-permissions' },
    { labelKey: 'nav.permissions', href: '/super-admin/permissions', icon: 'bi-key', permission: 'manage-permissions' },
    { labelKey: 'nav.books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { labelKey: 'nav.categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { labelKey: 'nav.circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { labelKey: 'nav.reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
];

export default function AdminLayout({ title, children }) {
    const { auth } = usePage().props;
    const navigation = auth?.user?.role === 'super-admin' ? superAdminNavigation : adminNavigation;

    return (
        <AuthenticatedLayout title={title} navigation={navigation}>
            {children}
        </AuthenticatedLayout>
    );
}
