import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from '../assets/solar-panel.png';
import icon_dark_mode from '../assets/solar.png'; // Icône pour le mode sombre
import 'leaflet/dist/leaflet.css';
import { useTheme } from './ThemeContext';

// Fix pour les icônes de marqueurs par défaut dans Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: icon,
});

// Composant pour ajuster la carte en fonction des marqueurs
function AutoZoom({ solarPanels }) {
  const map = useMap();

  useEffect(() => {
    if (solarPanels.length > 0) {
      const bounds = L.latLngBounds(solarPanels.map((panel) => panel.position));
      map.fitBounds(bounds, { padding: [50, 50] }); // Ajouter un padding pour éviter que les marqueurs ne touchent les bords
    }
  }, [solarPanels, map]);

  return null;
}

function SolarPanelMap() {
  const { isDarkMode } = useTheme();

  // Données des panneaux solaires localisés à Bouskoura, Maroc
  const solarPanels = useMemo(
    () => [
      {
        id: 1,
        name: 'Panel 1',
        position: [33.4465, -7.657], // Bouskoura, Maroc
        power: '150 kW',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Panel 2',
        position: [33.4495, -7.657], // Proche de Bouskoura
        power: '120 kW',
        status: 'Maintenance',
      },
      {
        id: 3,
        name: 'Panel 3',
        position: [33.4475, -7.657], // Proche de Bouskoura
        power: '200 kW',
        status: 'Active',
      },
    ],
    []
  );

  // Création des icônes en fonction du mode sombre
  const markerIcon = useMemo(
    () =>
      L.icon({
        iconUrl: isDarkMode ? icon_dark_mode : icon,
        iconSize: [32, 32], // Taille de l'icône
        iconAnchor: [16, 32], // Point d'ancrage de l'icône
        popupAnchor: [0, -32], // Position du popup par rapport à l'icône
      }),
    [isDarkMode]
  );

  return (
    <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Localisation des Panneaux Solaires
      </h2>
      <div className="h-96 w-full">
        <MapContainer
          center={[33.4489, -7.6486]} // Centrer sur Bouskoura (valeur par défaut)
          zoom={13} // Zoom par défaut
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // Désactiver le contrôle de zoom par défaut
        >
          {/* Utiliser une couche de tuiles adaptée au dark mode */}
          {isDarkMode ? (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          )}

          {solarPanels.map((panel) => (
            <Marker key={panel.id} position={panel.position} icon={markerIcon}>
              <Popup>
                <div className="text-gray-900 ">
                  <h3 className="font-bold">{panel.name}</h3>
                  <p>Puissance: {panel.power}</p>
                  <p>Statut: {panel.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          <AutoZoom solarPanels={solarPanels} /> {/* Ajouter l'auto-zoom */}
        </MapContainer>
      </div>
    </div>
  );
}

export default SolarPanelMap;