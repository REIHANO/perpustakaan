import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from './AuthenticatedLayout';

const adminNavigation = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
    { label: 'Books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { label: 'Categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { label: 'Circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { label: 'Reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
];

const superAdminNavigation = [
    { label: 'Dashboard', href: '/super-admin/dashboard', icon: 'bi-shield-lock' },
    { label: 'Users', href: '/super-admin/users', icon: 'bi-people', permission: 'manage-users' },
    { label: 'Roles', href: '/super-admin/roles', icon: 'bi-diagram-3', permission: 'manage-permissions' },
    { label: 'Permissions', href: '/super-admin/permissions', icon: 'bi-key', permission: 'manage-permissions' },
    { label: 'Books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { label: 'Categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { label: 'Circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { label: 'Reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
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
