// src/services/api.js
export const predictSolarPower = async (sensorData) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensorData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la prédiction');
      }
      const data = await response.json();
      return data.prediction;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };