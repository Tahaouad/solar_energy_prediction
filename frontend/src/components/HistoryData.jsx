import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Utilisez le thème Material-UI
import { useTheme as useCustomTheme } from './ThemeContext'; // Votre contexte de thème personnalisé

function HistoryData() {
  const [historyData, setHistoryData] = useState([]);
  const [selectedData, setSelectedData] = useState(['AC_POWER', 'AMBIENT_TEMPERATURE', 'MODULE_TEMPERATURE']);
  const muiTheme = useTheme(); // Thème Material-UI
  const { isDarkMode } = useCustomTheme(); // Votre contexte de thème personnalisé

  useEffect(() => {
    const fetchHistoryData = async () => {
      const response = await fetch('http://localhost:5000/history');
      const data = await response.json();
      setHistoryData(data);
    };

    fetchHistoryData();
  }, []);

  const handleChange = (event) => {
    setSelectedData(event.target.value);
  };

  return (
    <div className={` shadow-xl p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Historique des données</h2>
      <FormControl fullWidth className="mb-4">
        <InputLabel style={{ color: muiTheme.palette.text.primary }}>Données à afficher</InputLabel>
        <Select
          multiple
          value={selectedData}
          onChange={handleChange}
          style={{
            backgroundColor: muiTheme.palette.background.paper,
            color: muiTheme.palette.text.primary,
          }}
        >
          <MenuItem value="AC_POWER" style={{ color: muiTheme.palette.text.primary }}>
            Puissance AC
          </MenuItem>
          <MenuItem value="AMBIENT_TEMPERATURE" style={{ color: muiTheme.palette.text.primary }}>
            Température ambiante
          </MenuItem>
          <MenuItem value="MODULE_TEMPERATURE" style={{ color: muiTheme.palette.text.primary }}>
            Température module
          </MenuItem>
        </Select>
      </FormControl>
      <ResponsiveContainer width="100%" height={400}>
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
          {selectedData.includes('AC_POWER') && (
            <Line type="monotone" dataKey="AC_POWER" stroke={isDarkMode ? '#8884d8' : '#8884d8'} />
          )}
          {selectedData.includes('AMBIENT_TEMPERATURE') && (
            <Line type="monotone" dataKey="AMBIENT_TEMPERATURE" stroke={isDarkMode ? '#82ca9d' : '#82ca9d'} />
          )}
          {selectedData.includes('MODULE_TEMPERATURE') && (
            <Line type="monotone" dataKey="MODULE_TEMPERATURE" stroke={isDarkMode ? '#ff7300' : '#ff7300'} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistoryData;