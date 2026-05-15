import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useWebsitePage } from '@/hooks/useWebsitePage';
import { useSeo } from '@/hooks/useSeo';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  // We use the slug parameter to fetch from websitePages
  const { page, loading } = useWebsitePage(slug || '');

  useSeo({
    title: page?.title || '',
    description: page?.description || '',
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#c9a84c] mb-4" size={40} />
      </div>
    );
  }

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-card p-10 lg:p-14 rounded-3xl border border-border/40 shadow-sm">
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-8">
            {page.title}
          </h1>
          <div className="prose prose-amber max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-amber hover:prose-a:text-amber-dark prose-p:leading-relaxed">
            <ReactMarkdown>{page.content || ''}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
