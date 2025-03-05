# 🌞 Solar Energy Monitoring & Prediction System

Ce projet est une application web complète pour surveiller et prédire la production d'énergie solaire. Il comprend un backend Python pour le traitement des données, un script de génération de données de capteurs simulées, et un frontend React (avec Vite) pour une interface utilisateur moderne.

---

## 📌 Fonctionnalités

- **📊 Surveillance en temps réel** : Collecte et affiche des données simulées de production d'énergie solaire.
- **🤖 Prédiction** : Utilise un modèle SVR (Support Vector Regression) pour prédire la production d'énergie.
- **📥 Export des données** : Permet de télécharger les données historiques au format CSV.
- **🌓 Mode sombre** : Interface utilisateur avec support du mode sombre.

---

## 🛠️ Technologies Utilisées

- **Backend** : Python (Flask), Scikit-learn.
- **Frontend** : React, Vite, Tailwind CSS.
- **Données simulées** : Script Python pour générer des données de capteurs.

---

## 🚀 Installation et Utilisation

Suivez ces étapes pour configurer et exécuter le projet localement.

### 📌 Prérequis

- **Python 3.9+** : [Télécharger Python](https://www.python.org/downloads/)
- **Node.js 16+** : [Télécharger Node.js](https://nodejs.org/)
- **npm** : Installé avec Node.js.

---

### 1️⃣ Backend Python

Le backend est un serveur API construit avec Flask. Il expose des endpoints pour récupérer les données des capteurs et les prédictions.

#### a. Installer les dépendances
```bash
pip install -r API/requirements.txt
```

#### b. Installer les dépendances de la Fake API
```bash
cd FakeAPI
pip install -r requirements.txt
```

#### c. Démarrer le backend
```bash
python API/app.py
```

---

### 2️⃣ Fake API - Génération de données simulées

Allez dans le dossier FakeAPI et exécutez le script :
```bash
cd FakeAPI
python fake_sensor_data.py
```

Ce script envoie des données simulées au backend Flask.

---

### 3️⃣ Frontend React

Allez dans le dossier frontend et installez les dépendances Node.js :
```bash
cd frontend
npm install
```

Démarrez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse : [http://localhost:5173](http://localhost:5173).

---

## 📁 Structure du Projet

```plaintext
SOLAR_ENERGY_PREDICTION/
├── API/                  # Backend Flask
│   ├── models/           # Modèles d'apprentissage automatique
│   │   ├── svr_model.pkl # Modèle de prédiction SVR
│   ├── app.py            # Serveur API Flask
│   ├── requirements.txt  # Dépendances Python
│   └── ...
├── Data/                 # Données historiques
├── FakeAPI/              # Génération de données simulées
│   ├── fake_sensor_data.py # Script pour simuler les capteurs
│   ├── requirements.txt  # Dépendances pour Fake API
│   └── ...
├── frontend/             # Frontend React (Vite)
│   ├── public/           # Fichiers statiques
│   │   ├── sensor_history.csv  # Données CSV
│   │   ├── vite.svg      # Logo Vite
│   ├── src/              # Code source React
│   ├── package.json      # Dépendances frontend
│   ├── vite.config.js    # Configuration Vite
│   └── ...
└── README.md             # Documentation du projet
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Suivez ces étapes :

1. **Forkez** le dépôt.
2. **Créez** une branche pour votre fonctionnalité :
   ```bash
   git checkout -b feature/NouvelleFonctionnalite
   ```
3. **Committez** vos changements :
   ```bash
   git commit -m "Ajout d'une nouvelle fonctionnalité"
   ```
4. **Pushez** votre branche :
   ```bash
   git push origin feature/NouvelleFonctionnalite
   ```
5. **Ouvrez** une Pull Request.

---

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur

Taha Ouad - Développeur principal.

---

## 🎉 Remerciements

- **Vite** pour la configuration rapide du frontend.
- **Flask** pour le backend Python simple et efficace.
- **Tailwind CSS** pour le design moderne.

N'hésitez pas à explorer le code, ouvrir des issues ou contribuer ! 🚀

