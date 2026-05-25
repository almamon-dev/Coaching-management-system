import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';

export function useTranslation() {
    const { locale, translations } = usePage().props;

    const t = useCallback((key) => {
        // Return the translated string if it exists, otherwise return the original key
        if (translations && translations[key]) {
            return translations[key];
        }
        return key;
    }, [translations]);

    return { t, locale };
}
