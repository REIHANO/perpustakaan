import React from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { hasAnyPermission, hasPermission } from '../lib/permissions';

const defaultNavigation = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
    { label: 'Books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { label: 'Categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { label: 'Circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { label: 'Reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
];

export default function AuthenticatedLayout({ title, navigation, children }) {
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];

    const isAdminLike = hasAnyPermission(permissions, [
        'manage-books',
        'manage-categories',
        'manage-circulation',
        'set-fine',
        'view-reports',
        'manage-users',
    ]);

    const brandHref = auth?.user?.role === 'super-admin'
        ? '/super-admin/dashboard'
        : isAdminLike
            ? '/admin/dashboard'
            : '/member/dashboard';

    const navigationItems = navigation ?? defaultNavigation;
    const filteredNav = navigationItems.filter((item) => {
        if (!item.permission) {
            return true;
        }

        return hasPermission(permissions, item.permission);
    });

    return (
        <>
            <Sidebar brand="Perpustakaan" brandHref={brandHref} navigation={filteredNav} />
            <main className="content bg-light">
                <Navbar title={title} />
                <div className="px-3 px-md-4 pb-4">
                    {children}
                    <Footer />
                </div>
            </main>
        </>
    );
}
