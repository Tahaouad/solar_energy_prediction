import React, { useEffect, useState } from 'react';
import { FaThermometerHalf, FaSun, FaTint, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { useTheme } from './ThemeContext'; // Importez le contexte de thème

function CurrentData() {
  const [currentData, setCurrentData] = useState(null);
  const { isDarkMode } = useTheme(); // Utilisez le contexte pour obtenir l'état du thème

  useEffect(() => {
    const fetchCurrentData = async () => {
      const response = await fetch('/api/current-data');
      const data = await response.json();
      setCurrentData(data);
    };

    fetchCurrentData();
    const interval = setInterval(fetchCurrentData, 5000); // Mettre à jour toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  // Fonction pour vérifier si une valeur est dans la plage acceptable
  const getStatus = (value, min, max) => {
    return value >= min && value <= max ? 'BON' : 'NON';
  };

  // Seuils de performance pour chaque métrique
  const thresholds = {
    AMBIENT_TEMPERATURE: { min: 15, max: 35 },
    MODULE_TEMPERATURE: { min: 20, max: 50 },
    IRRADIATION: { min: 0.2, max: 1.0 },
    HUMIDITY: { min: 20, max: 80 },
  };

  return (
    <div className={` p-6 shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Données actuelles</h2>
      {currentData ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Température ambiante */}
          <div className="flex items-center space-x-2">
            <FaThermometerHalf className={isDarkMode ? 'text-blue-300' : 'text-blue-500'} />
            <p>Température ambiante : {currentData.AMBIENT_TEMPERATURE} °C</p>
            {getStatus(currentData.AMBIENT_TEMPERATURE, thresholds.AMBIENT_TEMPERATURE.min, thresholds.AMBIENT_TEMPERATURE.max) === 'BON' ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </div>

          {/* Température module */}
          <div className="flex items-center space-x-2">
            <FaThermometerHalf className={isDarkMode ? 'text-orange-300' : 'text-orange-500'} />
            <p>Température module : {currentData.MODULE_TEMPERATURE} °C</p>
            {getStatus(currentData.MODULE_TEMPERATURE, thresholds.MODULE_TEMPERATURE.min, thresholds.MODULE_TEMPERATURE.max) === 'BON' ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </div>

          {/* Irradiation */}
          <div className="flex items-center space-x-2">
            <FaSun className={isDarkMode ? 'text-yellow-300' : 'text-yellow-500'} />
            <p>Irradiation : {currentData.IRRADIATION} kW/m²</p>
            {getStatus(currentData.IRRADIATION, thresholds.IRRADIATION.min, thresholds.IRRADIATION.max) === 'BON' ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </div>

          {/* Humidité */}
          <div className="flex items-center space-x-2">
            <FaTint className={isDarkMode ? 'text-blue-200' : 'text-blue-300'} />
            <p>Humidité : {currentData.HUMIDITY} %</p>
            {getStatus(currentData.HUMIDITY, thresholds.HUMIDITY.min, thresholds.HUMIDITY.max) === 'BON' ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </div>
        </div>
      ) : (
        <CircularProgress size={24} />
      )}
    </div>
  );
}

export default CurrentData;