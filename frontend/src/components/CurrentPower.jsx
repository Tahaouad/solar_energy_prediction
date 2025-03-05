import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSun } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { useTheme } from './ThemeContext'; // Importez le contexte de thème

function CurrentPower() {
  const [currentPower, setCurrentPower] = useState(null);
  const { isDarkMode } = useTheme(); // Utilisez le contexte pour obtenir l'état du thème

  useEffect(() => {
    const fetchCurrentPower = async () => {
      const response = await fetch('/api/current-power');
      const data = await response.json();
      setCurrentPower(data.power);
    };

    fetchCurrentPower();
    const interval = setInterval(fetchCurrentPower, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour déterminer la couleur en fonction de la puissance
  const getPowerColor = (power) => {
    if (power < 100) return isDarkMode ? 'text-green-300' : 'text-green-500';
    if (power < 200) return isDarkMode ? 'text-yellow-300' : 'text-yellow-500';
    return isDarkMode ? 'text-red-300' : 'text-red-500';
  };

  return (
    <div className={` shadow-xl p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaSun className={isDarkMode ? 'text-yellow-300' : 'text-yellow-500'} />
        Puissance générée actuellement
      </h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-3xl font-semibold ${currentPower !== null ? getPowerColor(currentPower) : ''}`}
      >
        {currentPower !== null ? `${currentPower} kW` : <CircularProgress size={24} />}
      </motion.p>
    </div>
  );
}

export default CurrentPower;