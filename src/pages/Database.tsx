import React from 'react';
import DatabaseView from '@/components/mk/DatabaseView';

const decisions = [
  { id: 1, title: "12. Hukuk Dairesi - İcra Takibi İtirazı", year: 2023, category: "İcra Hukuku" },
  { id: 2, title: "9. Hukuk Dairesi - Kıdem Tazminatı Faizi", year: 2022, category: "İş Hukuku" },
  { id: 3, title: "1. Hukuk Dairesi - Tapu İptal ve Tescil", year: 2024, category: "Gayrimenkul Hukuku" },
];

const Database = () => {
  return <DatabaseView decisions={decisions} />;
};

export default Database;
