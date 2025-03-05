import random
import time
from datetime import datetime, timedelta
import pandas as pd
import os

# Chemin du fichier CSV pour stocker les données historiques
HISTORY_CSV_PATH = './sensor_history.csv'

def generate_realistic_temperature(month):
    """
    Génère une température réaliste en fonction du mois.
    """
    # Température moyenne par mois (en °C)
    monthly_temps = {
        1: 5,   # Janvier
        2: 6,   # Février
        3: 10,  # Mars
        4: 15,  # Avril
        5: 20,  # Mai
        6: 25,  # Juin
        7: 30,  # Juillet
        8: 29,  # Août
        9: 24,  # Septembre
        10: 18, # Octobre
        11: 12, # Novembre
        12: 7   # Décembre
    }
    base_temp = monthly_temps.get(month, 20)  # Température de base selon le mois
    return base_temp + random.uniform(-5, 5)  # Ajouter une variation aléatoire

def generate_realistic_irradiation(hour, month):
    """
    Génère une irradiation solaire réaliste en fonction de l'heure et du mois.
    """
    # Irradiation maximale à midi (en kW/m²)
    max_irradiation = {
        1: 0.5,  # Janvier
        2: 0.6,  # Février
        3: 0.8,  # Mars
        4: 1.0,  # Avril
        5: 1.2,  # Mai
        6: 1.4,  # Juin
        7: 1.5,  # Juillet
        8: 1.4,  # Août
        9: 1.2,  # Septembre
        10: 1.0, # Octobre
        11: 0.7, # Novembre
        12: 0.5  # Décembre
    }
    max_irr = max_irradiation.get(month, 1.0)  # Irradiation maximale selon le mois
    # Variation de l'irradiation en fonction de l'heure (max à midi)
    hour_factor = abs(12 - hour) / 12  # Facteur basé sur l'écart par rapport à midi
    return max_irr * (1 - hour_factor) + random.uniform(-0.1, 0.1)  # Ajouter une variation aléatoire

def generate_realistic_power(irradiation, temperature):
    """
    Simule la puissance générée en fonction de l'irradiation et de la température.
    """
    # Modèle simple : puissance = irradiation * (100 - température) * facteur
    power = irradiation * (100 - temperature) * 0.1
    return max(0, power)  # La puissance ne peut pas être négative

def generate_sensor_data():
    """
    Génère des données simulées pour un capteur.
    """
    now = datetime.now()
    hour = now.hour
    month = now.month
    
    # Générer des données réalistes
    ambient_temp = generate_realistic_temperature(month)
    module_temp = ambient_temp + random.uniform(5, 10)  # Panneaux plus chauds
    irradiation = generate_realistic_irradiation(hour, month)
    power = generate_realistic_power(irradiation, ambient_temp)
    
    return {
        "DATE_TIME": now.strftime('%Y-%m-%d %H:%M:%S'),
        "AMBIENT_TEMPERATURE": ambient_temp,
        "MODULE_TEMPERATURE": module_temp,
        "IRRADIATION": irradiation,
        "AC_POWER": power,
        "HOUR": hour,
        "DAY_OF_WEEK": now.weekday(),
        "MONTH": month
    }
def save_to_csv(data):
    """
    Sauvegarde les données dans un fichier CSV.
    """
    try:
        # Charger les données existantes
        df = pd.read_csv(HISTORY_CSV_PATH)
    except (FileNotFoundError, pd.errors.EmptyDataError):
        # Si le fichier n'existe pas ou est vide, créer un DataFrame vide avec les colonnes nécessaires
        df = pd.DataFrame(columns=data.keys())
    
    # Ajouter les nouvelles données
    new_row = pd.DataFrame([data])
    df = pd.concat([df, new_row], ignore_index=True)
    
    # Limiter le fichier aux 100 dernières entrées (par exemple)
    if len(df) > 100:
        df = df.tail(100)
    
    # Sauvegarder dans le fichier CSV
    df.to_csv(HISTORY_CSV_PATH, index=False)
    print("Données sauvegardées dans le fichier CSV.")  # Log de la sauvegarde

def simulate_iot():
    """
    Simule un capteur IoT qui génère des données toutes les 5 secondes.
    """
    while True:
        sensor_data = generate_sensor_data()
        print("Données des capteurs générées:", sensor_data)
        
        # Sauvegarder les données dans le fichier CSV
        save_to_csv(sensor_data)
        
        time.sleep(5)

if __name__ == "__main__":
    simulate_iot()