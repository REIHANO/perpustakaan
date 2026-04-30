import React from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';

const navigation = [
    { label: 'Dashboard', href: '/super-admin/dashboard', icon: 'bi-shield-lock' },
    { label: 'Users', href: '/super-admin/users', icon: 'bi-people', permission: 'manage-users' },
    { label: 'Roles', href: '/super-admin/roles', icon: 'bi-diagram-3', permission: 'manage-permissions' },
    { label: 'Permissions', href: '/super-admin/permissions', icon: 'bi-key', permission: 'manage-permissions' },
    { label: 'Books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { label: 'Categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { label: 'Circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { label: 'Reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
];

export default function SuperAdminLayout({ title, children }) {
    return (
        <AuthenticatedLayout title={title} navigation={navigation}>
            {children}
        </AuthenticatedLayout>
    );
}
