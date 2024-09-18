import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/index.css';
import { AuthProvider } from './context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas
import './firebase/firebaseConfig.js'; // Importa tu configuración de Firebase (no necesitas nada más si ya inicializaste Firebase aquí)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);