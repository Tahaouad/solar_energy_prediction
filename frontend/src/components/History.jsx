import React from 'react';
import HistoryData from './HistoryData';
import { useTheme } from './ThemeContext';

function History() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold mb-8">Historique des Données</h1>
      <HistoryData />
    </div>
  );
}

export default History;