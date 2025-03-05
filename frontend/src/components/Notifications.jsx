import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notifications() {
  useEffect(() => {
    // Simuler une alerte (remplacez par un appel API)
    const alert = "Maintenance nécessaire : production inférieure aux attentes.";
    toast.warn(alert, { position: "top-right", autoClose: 5000 });
  }, []);

  return <ToastContainer />;
}

export default Notifications;