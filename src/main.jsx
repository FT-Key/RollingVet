import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/index.css';
import { AuthProvider } from './context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas
import { HelmetProvider } from 'react-helmet-async'; // Importa HelmetProvider
import './firebase/firebaseConfig.js'; // Importa tu configuración de Firebase

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider> {/* Envuelve App con HelmetProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
);