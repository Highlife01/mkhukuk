import React from 'react';
import HomeView from '@/components/mk/HomeView';
import { useSeo } from '@/hooks/useSeo';
import { useWebsitePage } from '@/hooks/useWebsitePage';

const Index = () => {
  const { page } = useWebsitePage('home');

  useSeo({
    title: page?.title || 'Ana Sayfa',
    description:
      page?.description ||
      'Av. Mahmut Kaya Hukuk & Danışmanlık – Profesyonel ve teknoloji odaklı hukuki çözüm ortaklığınız. Uzman kadromuzla haklarınız için yanınızdayız.',
    url: 'https://www.avmahmutkaya.com.tr/',
  });

  return <HomeView />;
};

export default Index;
