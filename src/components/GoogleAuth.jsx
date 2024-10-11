import React from 'react';
import { auth, googleProvider } from '../firebase/firebaseConfig.js';
import { useAuth } from '../context/AuthContext';
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

      const accessToken = credential.accessToken;
      const idToken = credential.idToken;

      const apiUrl = import.meta.env.VITE_API_URL;
      const ruta = useParameter === "login" ? "/login" : "/register";

      const serverData = await postServerData(apiUrl, ruta, { token: accessToken });

      const { token: jwtToken } = serverData;

      loginContext(jwtToken);
      navigate('/');
    } catch (error) {
      console.error("Error al obtener la información del usuario o al llamar a la API:", error);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleLogin = async () => {
    const provident = new GoogleAuthProvider();
    provident.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provident);
      handleSuccess(result);
    } catch (error) {
      alert(error.message);
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