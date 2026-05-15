import { useEffect } from 'react';

export interface SeoOptions {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  keywords?: string;
  jsonLd?: Record<string, any>;
}

const setMetaTag = (name: string, value: string | undefined, property = false) => {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!value) {
    if (element) {
      element.remove();
    }
    return;
  }

  if (!element) {
    element = document.createElement('meta');
    if (property) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
};

const setLinkTag = (rel: string, href: string) => {
  const selector = `link[rel="${rel}"]`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

export const useSeo = ({
  title,
  description,
  url,
  image,
  type,
  keywords,
  jsonLd,
}: SeoOptions) => {
  useEffect(() => {
    const baseTitle = 'Av. Mahmut Kaya';
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    document.title = fullTitle;

    setMetaTag('description', description);
    setMetaTag('keywords', keywords);

    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type ?? 'website', true);
    setMetaTag('og:url', url ?? window.location.href, true);
    setMetaTag('og:image', image, true);

    setMetaTag('twitter:card', image ? 'summary_large_image' : 'summary', false);
    setMetaTag('twitter:title', fullTitle, false);
    setMetaTag('twitter:description', description, false);
    setMetaTag('twitter:image', image, false);

    if (url) {
      setLinkTag('canonical', url);
    }

    const jsonLdId = 'seo-json-ld';
    let script = document.head.querySelector<HTMLScriptElement>(`script[id="${jsonLdId}"]`);

    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Av. Mahmut Kaya',
      url: 'https://www.avmahmutkaya.com.tr',
      logo: 'https://www.avmahmutkaya.com.tr/logo.png',
      sameAs: [
        'https://www.linkedin.com/company/avmahmutkaya',
        'https://www.facebook.com/mkhukuk',
        'https://www.instagram.com/mkhukuk',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+90 312 000 00 00',
          contactType: 'customer service',
          areaServed: 'TR',
          availableLanguage: ['Turkish', 'English'],
        },
      ],
    };

    const finalJsonLd = jsonLd ? { ...defaultJsonLd, ...jsonLd } : defaultJsonLd;

    if (!script) {
      script = document.createElement('script');
      script.id = jsonLdId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(finalJsonLd, null, 2);
  }, [title, description, url, image, type, keywords, jsonLd]);
};
