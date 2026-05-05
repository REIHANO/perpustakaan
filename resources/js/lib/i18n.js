import { usePage } from '@inertiajs/react';

export function useI18n() {
    const page = usePage();
    const locale = page.props.locale || 'id';
    const translations = page.props.translations || {};
    const supportedLocales = page.props.supportedLocales || [];

    const t = (key, fallback = '') => {
        const value = key.split('.').reduce((acc, part) => acc?.[part], translations);
        return value ?? fallback ?? key;
    };

    return {
        locale,
        supportedLocales,
        t,
    };
}
