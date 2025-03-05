from flask import Flask, request, jsonify
from flask_cors import CORS  
import joblib
import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  


# Chemin du fichier CSV pour les données historiques
HISTORY_CSV_PATH = 'C:/Users/tahao/workspace/solar_energy_prediction/sensor_history.csv'
# Charger le modèle
model = joblib.load('./models/svr_model.pkl')

# Fonction pour prédire la production d'énergie
def predict_power(features):
    return model.predict(features)

# Endpoint pour prédire la production
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    features = np.array([[
        data['AMBIENT_TEMPERATURE'],
        data['MODULE_TEMPERATURE'],
        data['IRRADIATION'],
        data['HOUR'],
        data['DAY_OF_WEEK'],
        data['MONTH']
    ]])
    prediction = predict_power(features)
    return jsonify({'prediction': prediction.tolist()})

# Endpoint pour prédire la production des prochains jours
@app.route('/predict-future', methods=['GET'])
def predict_future():
    # Simuler des prévisions météo pour les prochains jours
    future_data = []
    for i in range(1, 4):  # Prédictions pour les 3 prochains jours
        date = datetime.now() + timedelta(days=i)
        future_data.append({
            'DATE_TIME': date.strftime('%Y-%m-%d %H:%M:%S'),
            'AMBIENT_TEMPERATURE': np.random.uniform(20, 40),
            'MODULE_TEMPERATURE': np.random.uniform(25, 50),
            'IRRADIATION': np.random.uniform(0, 1),
            'HOUR': date.hour,
            'DAY_OF_WEEK': date.weekday(),
            'MONTH': date.month
        })
    
    predictions = []
    for day in future_data:
        features = np.array([[
            day['AMBIENT_TEMPERATURE'],
            day['MODULE_TEMPERATURE'],
            day['IRRADIATION'],
            day['HOUR'],
            day['DAY_OF_WEEK'],
            day['MONTH']
        ]])
        prediction = predict_power(features)
        predictions.append({'date': day['DATE_TIME'], 'prediction': prediction[0]})
    
    return jsonify({'predictions': predictions})

# Endpoint pour vérifier la maintenance
@app.route('/check-maintenance', methods=['GET'])
def check_maintenance():
    # Simuler des données réelles et prédites
    actual_power = np.random.uniform(100, 200)
    predicted_power = np.random.uniform(150, 250)
    
    if actual_power < predicted_power * 0.9:  # Seuil de 10 %
        return jsonify({'maintenance_alert': 'Maintenance nécessaire : production inférieure aux attentes.'})
    return jsonify({'maintenance_alert': 'Aucune maintenance nécessaire.'})

# Endpoint pour identifier les équipements défectueux
@app.route('/faulty-equipment', methods=['GET'])
def faulty_equipment():
    # Simuler des données de panneaux
    panels = {
        'Panel_1': {'AC_POWER': 100, 'EXPECTED_POWER': 150},
        'Panel_2': {'AC_POWER': 0, 'EXPECTED_POWER': 150},
        'Panel_3': {'AC_POWER': 120, 'EXPECTED_POWER': 150},
    }
    
    faulty_panels = [panel_id for panel_id, data in panels.items() if data['AC_POWER'] < data['EXPECTED_POWER'] * 0.5]
    return jsonify({'faulty_panels': faulty_panels})

@app.route('/current-power', methods=['GET'])
def current_power():
    # Simuler la puissance actuelle (remplacez par des données réelles si disponibles)
    power = np.random.uniform(100, 200)  # kW
    return jsonify({'power': power})

@app.route('/alerts', methods=['GET'])
def get_alerts():
    alerts = []
    # Simuler des alertes
    if random.random() < 0.2:  # 20 % de chance d'avoir une alerte
        alerts.append("Maintenance nécessaire : production inférieure aux attentes.")
    if random.random() < 0.1:  # 10 % de chance d'avoir une alerte
        alerts.append("Équipement défectueux détecté : Panel_2.")
    return jsonify({'alerts': alerts})

# {
#     "error": "[Errno 2] No such file or directory: '../sensor_history.csv'"
# }


# Endpoint pour récupérer les données historiques
@app.route('/history', methods=['GET'])
def get_history():
    try:
        history_df = pd.read_csv(HISTORY_CSV_PATH)
        
        if history_df.empty:
            return jsonify({"message": "No data available."})
        
        last_100_entries = history_df.tail(100).to_dict(orient='records')
        return jsonify(last_100_entries)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint pour récupérer les données actuelles
@app.route('/current-data', methods=['GET'])
def get_current_data():
    try:
        # Simuler des données actuelles (remplacez par des données réelles si disponibles)
        current_data = {
            "DATE_TIME": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "AMBIENT_TEMPERATURE": np.random.uniform(20, 40),
            "MODULE_TEMPERATURE": np.random.uniform(25, 50),
            "IRRADIATION": np.random.uniform(0, 1),
            "AC_POWER": np.random.uniform(100, 200),
            "HUMIDITY": np.random.uniform(30, 70),  # Humidité simulée
        }
        return jsonify(current_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)