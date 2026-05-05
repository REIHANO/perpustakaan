import React from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { hasAnyPermission, hasPermission } from '../lib/permissions';
import { useI18n } from '../lib/i18n';

const defaultNavigation = [
    { labelKey: 'nav.dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
    { labelKey: 'nav.books', href: '/admin/books', icon: 'bi-book', permission: 'manage-books' },
    { labelKey: 'nav.categories', href: '/admin/categories', icon: 'bi-tags', permission: 'manage-categories' },
    { labelKey: 'nav.circulation', href: '/admin/circulation', icon: 'bi-arrow-left-right', permission: 'manage-circulation' },
    { labelKey: 'nav.reports', href: '/admin/reports', icon: 'bi-clipboard-data', permission: 'view-reports' },
];

export default function AuthenticatedLayout({ title, navigation, children }) {
    const { auth } = usePage().props;
    const { t } = useI18n();
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
    const filteredNav = navigationItems
        .filter((item) => {
            if (!item.permission) {
                return true;
            }

            return hasPermission(permissions, item.permission);
        })
        .map((item) => ({
            ...item,
            label: item.labelKey ? t(item.labelKey, item.label || '') : item.label,
        }));

    return (
        <>
            <Sidebar brand={t('brand', 'Perpustakaan')} brandHref={brandHref} navigation={filteredNav} />
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
