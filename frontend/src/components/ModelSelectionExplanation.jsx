import React from 'react';
import { useTheme } from './ThemeContext';
import Figure1 from '../assets/Figure_1.png';
import Figure2 from '../assets/Figure_2.png';
import Figure3 from '../assets/Figure_3.png';

function ModelSelectionExplanation() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-4 md:p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Pourquoi avons-nous choisi le modèle SVR ?
      </h1>

      {/* Étapes du Projet */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Étapes du Projet</h2>
        <div className="space-y-4">
          <p>
            <strong>1. Collecte des données :</strong> Nous avons utilisé des données de production d'énergie solaire et des données météorologiques pour entraîner notre modèle.
          </p>
          <p>
            <strong>2. Prétraitement des données :</strong> Les données ont été nettoyées, normalisées et fusionnées pour créer un ensemble de données cohérent.
          </p>
          <p>
            <strong>3. Sélection des caractéristiques :</strong> Nous avons sélectionné des caractéristiques pertinentes comme la température ambiante, l'irradiation, et l'heure de la journée.
          </p>
          <p>
            <strong>4. Entraînement des modèles :</strong> Plusieurs modèles de régression ont été entraînés, y compris la régression linéaire, Random Forest, et SVR.
          </p>
          <p>
            <strong>5. Évaluation des modèles :</strong> Les modèles ont été évalués en utilisant l'erreur absolue moyenne (MAE) et le coefficient de détermination (R²).
          </p>
        </div>
      </section>

      {/* Pourquoi SVR ? */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Pourquoi SVR ?</h2>
        <div className="space-y-4">
          <p>
            Le modèle <strong>Support Vector Regression (SVR)</strong> a été choisi pour plusieurs raisons :
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Robustesse aux données non linéaires :</strong> SVR est capable de capturer des relations complexes et non linéaires entre les caractéristiques et la cible.
            </li>
            <li>
              <strong>Résistance au surajustement :</strong> Grâce à la régularisation, SVR évite le surajustement même avec un nombre limité de données.
            </li>
            <li>
              <strong>Flexibilité :</strong> SVR permet d'utiliser différents noyaux (kernel) pour adapter le modèle à différents types de données.
            </li>
          </ul>
          <p>
            Dans notre cas, SVR a fourni les meilleures performances en termes de précision (R²) et d'erreur absolue moyenne (MAE) par rapport aux autres modèles testés.
          </p>
        </div>
      </section>

      {/* Comparaison des Modèles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Comparaison des Modèles</h2>
        <div className="overflow-x-auto">
          <table className={`min-w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded-lg overflow-hidden`}>
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Modèle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  MAE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  R²
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  Linear Regression
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  438.656058
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  0.993618
                </td>
              </tr>
              <tr className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  Random Forest
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  213.992260
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  0.996368
                </td>
              </tr>
              <tr className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  SVR
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  835.318428
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  0.960393
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-bold mt-6">Décision : SVR pour éviter l'overfitting</h3>
      </section>

      {/* Visualisation des Prédictions vs Réelles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Visualisation des Prédictions vs Réelles</h2>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-6 rounded-lg`}>
          <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Figure 1 : Comparaison des valeurs réelles et prédites pour RandomForestRegressor
          </p>
          <img src={Figure3} alt="Comparaison des valeurs réelles et prédites" className="mx-auto my-2 w-full max-w-lg" />
        </div>
      </section>

      {/* Extrait de Code */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Extrait de Code</h2>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded-lg overflow-x-auto`}>
          <pre className="text-sm">
            <code className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
{`# Entraînement du modèle SVR
svr_model = SVR(kernel='rbf', C=500, gamma=0.01, epsilon=10)
svr_model.fit(X_train, y_train)

# Prédictions
svr_predictions = svr_model.predict(X_test)

# Évaluation
mae = mean_absolute_error(y_test, svr_predictions)
r2 = r2_score(y_test, svr_predictions)
print(f"MAE: {mae}, R²: {r2}")`}
            </code>
          </pre>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Ce code montre comment le modèle SVR est entraîné et évalué. Les hyperparamètres comme `C`, `gamma`, et `epsilon` ont été ajustés pour optimiser les performances.
          </p>
        </div>
      </section>

      {/* Visualisations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Visualisations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-6 rounded-lg`}>
            <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Figure 1 : Matrice de corrélation</p>
            <img src={Figure1} alt="Matrice de corrélation" className="w-full" />
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-6 rounded-lg`}>
            <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Figure 2 : Prédictions vs Réelles</p>
            <img src={Figure2} alt="Prédictions vs Réelles" className="w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ModelSelectionExplanation;