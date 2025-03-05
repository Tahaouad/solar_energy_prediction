import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartLine } from 'react-icons/fa';
import { useTheme } from './ThemeContext'; // Importez le contexte de thème

function HistoryChart() {
  const [historyData, setHistoryData] = useState([]);
  const [period, setPeriod] = useState(5); // Default to last 5 days
  const { isDarkMode } = useTheme(); // Utilisez le contexte pour obtenir l'état du thème

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await fetch(`/api/history?days=${period}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données historiques :", error);
      }
    };

    fetchHistoryData();
    const interval = setInterval(fetchHistoryData, 60000); // Mettre à jour toutes les minutes
    return () => clearInterval(interval);
  }, [period]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card shadow-xl p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaChartLine className={isDarkMode ? 'text-blue-300' : 'text-blue-500'} />
        Historique de production
      </h2>
      <select
        value={period}
        onChange={(e) => setPeriod(Number(e.target.value))}
        className={`w-full p-2 mb-4 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
      >
        <option value={5} className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}>
          5 derniers jours
        </option>
        <option value={30} className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}>
          30 derniers jours
        </option>
      </select>
      {historyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
            <XAxis
              dataKey="DATE_TIME"
              stroke={isDarkMode ? '#fff' : '#000'}
              tick={{ fill: isDarkMode ? '#fff' : '#000' }}
            />
            <YAxis
              stroke={isDarkMode ? '#fff' : '#000'}
              tick={{ fill: isDarkMode ? '#fff' : '#000' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#333' : '#fff',
                borderColor: isDarkMode ? '#555' : '#ccc',
                color: isDarkMode ? '#fff' : '#000',
              }}
            />
            <Legend
              wrapperStyle={{
                color: isDarkMode ? '#fff' : '#000',
              }}
            />
            <Line
              type="monotone"
              dataKey="AC_POWER"
              stroke={isDarkMode ? '#8884d8' : '#8884d8'}
              name="Puissance AC (kW)"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Aucune donnée disponible.</p>
      )}
    </motion.div>
  );
}

export default HistoryChart;