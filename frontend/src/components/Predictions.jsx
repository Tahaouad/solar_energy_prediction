import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from './ThemeContext'; // Importez le contexte de thème

function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const { isDarkMode } = useTheme(); // Utilisez le contexte pour obtenir l'état du thème

  useEffect(() => {
    // Récupérer les prédictions pour les prochains jours
    const fetchPredictions = async () => {
      const response = await fetch('/api/predict-future');
      const data = await response.json();
      setPredictions(data.predictions);
    };

    fetchPredictions();
  }, []);

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Prédictions pour les prochains jours</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={predictions}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
          <XAxis
            dataKey="date"
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
          <Line type="monotone" dataKey="prediction" stroke={isDarkMode ? '#8884d8' : '#8884d8'} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Predictions;