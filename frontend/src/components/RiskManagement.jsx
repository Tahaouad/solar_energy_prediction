import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from './ThemeContext';
import gif from '../assets/gif.gif';


function RiskManagement() {

    const { isDarkMode } = useTheme(); // Utilisez le contexte pour obtenir l'état du thème

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simuler une requête API pour obtenir les alertes
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data.alerts);
      } catch (error) {
        console.error("Erreur lors de la récupération des alertes :", error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Mettre à jour toutes les 10 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaExclamationTriangle className="text-orange-500" />
        Gestion des risques
      </h2>
      <AnimatePresence>
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-2 text-green-600"
          >
            <FaCheckCircle className="text-green-500" />
            Aucun risque actuel. Tout fonctionne normalement.
          </motion.div>
        ) : (
          <motion.ul className="space-y-2">
            {alerts.map((alert, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 text-red-600"
              >
                <FaExclamationTriangle className="text-red-500" />
                {alert}
                <img src={gif} alt="gif" Width={100} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RiskManagement;