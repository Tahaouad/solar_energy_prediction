import React from 'react';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import home from '../assets/home.png';
import ModelSelectionExplanation from './ModelSelectionExplanation';

function LandingPage() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <header className={`p-4 flex flex-col md:flex-row justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-lg`}>
        {/* Logo */}
        <div className="text-2xl font-bold text-green-500 mb-4 md:mb-0">EcoDash</div>

        {/* Navigation et Bouton Dark Mode */}
        <div className="flex items-center space-x-4">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/dashboard"
                  className={`hover:bg-green-600 transition-colors duration-300 text-white bg-green-500 px-4 py-2 rounded-full font-bold text-sm md:text-base`}
                >
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className={`hover:bg-green-600 transition-colors duration-300 text-white bg-green-500 px-4 py-2 rounded-full font-bold text-sm md:text-base`}
                >
                  Historique
                </Link>
              </li>
            </ul>
          </nav>
          {/* Bouton Dark Mode */}
          <ThemeToggle />
        </div>
      </header>

      {/* Section Héros */}
      <section className={`flex-grow py-12 md:py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Texte à Gauche */}
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Optimisez Votre Énergie Solaire</h1>
            <p className="mb-8 text-lg md:text-xl text-gray-600">
              EcoDash vous aide à surveiller et optimiser votre production d'énergie solaire avec des données en temps réel.
            </p>
            <Link
              to="/dashboard"
              className={`inline-block px-8 py-3 rounded-lg text-lg font-semibold ${
                isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors duration-300`}
            >
              Exemple d'utilisation avec des données générées aléatoirement
            </Link>
          </div>

          {/* Image à Droite */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src={home}
              alt="Énergie solaire"
              className="rounded-lg shadow-xl w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Section Explication du Modèle */}
      <section className={`p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <ModelSelectionExplanation />
          </div>
        </div>
      </section>

      {/* Section À Propos */}
      <section className={`p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">À Propos d'EcoDash</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            EcoDash est une plateforme innovante conçue pour vous aider à surveiller, analyser et optimiser votre production d'énergie solaire.
            Grâce à des outils avancés, vous pouvez prendre des décisions éclairées pour maximiser votre efficacité énergétique.
          </p>
        </div>
      </section>

      <footer className={`text-center p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-lg`}>
        <p className="text-sm md:text-base text-gray-600">&copy; 2023 EcoDash. Tous droits réservés.</p>
        <div className="mt-4">
          <Link
            to="/dashboard"
            className="mx-2 hover:text-green-500 transition-colors duration-300 text-sm md:text-base"
          >
            Tableau de bord
          </Link>
          <Link
            to="/history"
            className="mx-2 hover:text-green-500 transition-colors duration-300 text-sm md:text-base"
          >
            Historique
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;