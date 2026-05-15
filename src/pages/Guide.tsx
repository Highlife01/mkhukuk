import React from 'react';
import GuideView from '@/components/mk/GuideView';
import { useSeo } from '@/hooks/useSeo';

const Guide = () => {
  useSeo({
    title: 'Hukuk Rehberi',
    description: 'MK Hukuk rehberleri ve kılavuzları ile hukuki süreçlerinizde adım adım yol haritası. İcra, miras, inşaat ve daha fazla konuda bilgi alın.',
    url: 'https://mkhukuk.web.app/rehber',
  });

  return <GuideView />;
};

export default Guide;
