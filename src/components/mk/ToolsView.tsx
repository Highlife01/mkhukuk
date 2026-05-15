import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LegalToolsHub from './tools/LegalToolsHub';
import VekaletUcreti from './tools/VekaletUcreti';
import KiraArtisi from './tools/KiraArtisi';
import TazminatHesabi from './tools/TazminatHesabi';

const ToolsView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useEffect(() => {
    const toolId = searchParams.get('tool');
    if (toolId) {
      setActiveTool(toolId);
    }
  }, [searchParams]);

  const renderTool = () => {
    switch (activeTool) {
      case 'vekalet-ucreti':
        return <VekaletUcreti onBack={() => setActiveTool(null)} />;
      case 'kira-artis':
        return <KiraArtisi onBack={() => setActiveTool(null)} />;
      case 'tazminat-hesabi':
        return <TazminatHesabi onBack={() => setActiveTool(null)} />;
      default:
        return <LegalToolsHub onSelectTool={(id) => setActiveTool(id)} />;
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#f8f5ef] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderTool()}
      </div>
    </div>
  );
};

export default ToolsView;
