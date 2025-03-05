import React from 'react';
import { useTheme } from './ThemeContext'; // Importez le contexte de thème
import { FaFileDownload } from 'react-icons/fa'; // Importez une icône pour le bouton

function ExportData() {
  const { isDarkMode } = useTheme(); // Utilisez le contexte pour obtenir l'état du thème

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-xl font-semibold mb-4">Exporter les données</h2>
      <a
        href="/sensor_history.csv" // Chemin vers le fichier dans le dossier public
        download="sensor_history.csv" // Nom du fichier à télécharger
        className={`flex items-center justify-center gap-2 p-3 rounded transition-all duration-300 ${
          isDarkMode
            ? 'bg-green-700 hover:bg-green-600 text-white'
            : 'bg-green-600 hover:bg-green-500 text-white'
        }`}
      >
        <FaFileDownload className="text-lg" />
        Télécharger en CSV
      </a>
    </div>
  );
}

export default ExportData;