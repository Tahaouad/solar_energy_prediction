import React from 'react';
import CurrentPower from './CurrentPower';
import RiskManagement from './RiskManagement';
import Predictions from './Predictions';
import HistoryChart from './HistoryChart';
import Notifications from './Notifications';
import ExportData from './ExportData';
import CurrentData from './CurrentData';
import { useTheme } from './ThemeContext';
import SolarPanelMap from './SolarPanelMap';

function Dashboard() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <Notifications />
      <h1 className="text-4xl text-green-500 font-bold mb-8">Tableau de Bord</h1>
      <hr className='my-4 border-green-500 dark:border-gray-600' />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CurrentPower />
        <RiskManagement />
        <Predictions />
        <CurrentData />
        <HistoryChart />
        <ExportData />
      </div>
      <SolarPanelMap />

    </div>
  );
}

export default Dashboard;