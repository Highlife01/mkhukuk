import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { websitePages as staticWebsitePages, WebsitePage } from '@/data/websitePages';

export const useWebsitePage = (slug: string) => {
    const [page, setPage] = useState<WebsitePage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setPage(null);
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'websitePages', slug);
        const unsub = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setPage({ slug: snapshot.id, ...(snapshot.data() as Omit<WebsitePage, 'slug'>) });
                } else {
                    const fallback = staticWebsitePages.find((p) => p.slug === slug) ?? null;
                    setPage(fallback);
                }
                setLoading(false);
            },
            () => {
                const fallback = staticWebsitePages.find((p) => p.slug === slug) ?? null;
                setPage(fallback);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [slug]);

    return { page, loading };
};

