import React from 'react';
import { auth, googleProvider } from '../firebase/firebaseConfig.js'; // Importa tu configuración de Firebase
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { postServerData } from '../helpers/ServerCalling.js';
import '../css/GoogleAuth.css';

const GoogleAuth = ({ useParameter }) => {
  const { loginContext } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (result) => {
    try {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.idToken; // Obtén el id_token en lugar del access_token

      // Envía el id_token al servidor para su verificación
      const apiUrl = import.meta.env.VITE_API_URL;
      const ruta = useParameter === "login" ? "/login" : "/register";

      const serverData = await postServerData(apiUrl, ruta, { token: idToken });

      console.log(serverData.msg);
      const { token: jwtToken } = serverData;

      // Llama al login del contexto global
      loginContext(jwtToken);
      navigate('/');
    } catch (error) {
      console.error("Error al obtener la información del usuario o al llamar a la API:", error);
    }
  };

  const handleError = (error) => {
    console.log("Inicio de sesión fallido");
    console.log(error);
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      handleSuccess(result);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <button className="btn btn-light google-login" onClick={handleLogin}>
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{ width: '20px', marginRight: '10px' }} />
      Continuar con Google
    </button>
  );
};

export default GoogleAuth;