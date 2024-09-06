import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import "../css/GoogleAuth.css";
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { useNavigate } from "react-router-dom";
import { postServerData } from "../helpers/ServerCalling";
import { redirectAfterLogin } from "../helpers/Redirects";

const GoogleAuth = ({ type, useParameter }) => {

  const navigate = useNavigate();
  const { loginContext } = useAuth(); // Usar loginContext para manejar el login

  const handleSuccess = async (response) => {
    try {
      let token;
      let userInfo;

      // Manejar la estructura de la respuesta según el origen
      if (response.credential) {
        token = response.credential;
        userInfo = JSON.parse(atob(token.split(".")[1]));
      } else if (response.access_token) {
        token = response.access_token;
        // Puedes realizar una llamada a la API de Google para obtener la información del usuario usando el access_token si es necesario
        const userResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        userInfo = await userResponse.json();
      }

      // Enviar el token al servidor para su verificación usando postServerData
      const apiUrl = import.meta.env.VITE_API_URL;
      const ruta = useParameter === "login" ? "/login" : "/register";

      const serverData = await postServerData(apiUrl, ruta, { token });

      console.log(serverData.msg);
      const { token: jwtToken } = serverData; // Desestructura el token del JSON

      // Llamar al login del contexto global
      loginContext(jwtToken);
      redirectAfterLogin(navigate);

    } catch (error) {
      console.error(
        "Error al obtener la información del usuario o al llamar a la API de Google:",
        error
      );
    }
  };

  const handleError = (error) => {
    console.log("Inicio de sesión fallido");
    console.log(error);
    // Maneja el error del inicio de sesión
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      handleSuccess(credentialResponse);
    },
    onError: (error) => {
      handleError(error);
      // Maneja el error del inicio de sesión (por ejemplo, muestra un mensaje al usuario)
    },
  });

  return (
    <>
      {type === "default" && (
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      )}

      {type === "custom" && (
        <button
          className="btn btn-light google-login"
          onClick={() => loginWithGoogle()}
        >
          <i className="bi bi-google pe-1" />
          Continuar con Google
        </button>
      )}

      {type === "onetap" && (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handleSuccess(credentialResponse);
          }}
          onError={(error) => {
            console.log("Inicio de sesión One Tap fallido");
            handleError(error);
          }}
          useOneTap
        />
      )}
    </>
  );
};

export default GoogleAuth;