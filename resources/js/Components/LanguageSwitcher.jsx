import React from 'react';
import { router } from '@inertiajs/react';
import { Form } from '@themesberg/react-bootstrap';
import { useI18n } from '../lib/i18n';

export default function LanguageSwitcher({ compact = false, className = '' }) {
    const { locale, supportedLocales, t } = useI18n();
    const locales = supportedLocales.length ? supportedLocales : [
        { code: 'id', label: 'Bahasa Indonesia' },
        { code: 'en', label: 'English' },
    ];

    const handleChange = (event) => {
        const nextLocale = event.target.value;
        if (nextLocale === locale) {
            return;
        }

        router.post('/language', { locale: nextLocale }, {
            preserveScroll: true,
            preserveState: false,
            replace: true,
        });
    };

    return (
        <div className={`d-inline-flex align-items-center gap-2 ${className}`.trim()}>
            <i className="bi bi-translate text-muted" />
            <Form.Select
                aria-label={t('common.language', 'Language')}
                size={compact ? 'sm' : undefined}
                value={locale}
                onChange={handleChange}
                style={{ minWidth: compact ? 140 : 160 }}
            >
                {locales.map((option) => (
                    <option key={option.code} value={option.code}>
                        {option.label}
                    </option>
                ))}
            </Form.Select>
        </div>
    );
}
