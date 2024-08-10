import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Usa la exportación nombrada
import '../css/GoogleAuth.css';

const GoogleAuth = ({ type }) => {

  const handleSuccess = async (response) => {
    /* console.log("------------------------");
    console.log("Nombre: ", userInfo.given_name);
    console.log("Apellido: ", userInfo.family_name);
    console.log("Nombre completo: ", userInfo.name);
    console.log("Email: ", userInfo.email);
    console.log("¿Email verificado?: ", userInfo.email_verified ? "Si" : "No");
    console.log("Imagen de perfil URL: ", userInfo.picture);
    console.log("El identificador único del usuario (sub): ", userInfo.sub);
    console.log("Identificador único del token (jti): ", userInfo.jti);
    console.log("El emisor del token (iss): ", userInfo.iss);
    console.log("La audiencia para la cual el token de ID está destinado (aud): ", userInfo.aud);
    console.log("La parte autorizada para usar el token (azp): ", userInfo.azp);
    console.log("Fecha y hora en que el token se vuelve válido (nbf): ", userInfo.nbf);
    console.log("Fecha y hora de emisión del token (iat): ", userInfo.iat);
    console.log("Fecha y hora de expiración del token (exp): ", userInfo.exp);
    console.log("------------------------"); */

    try {
      let token;
      let userInfo;

      // Manejar la estructura de la respuesta según el origen
      if (response.credential) {
        token = response.credential;
        userInfo = JSON.parse(atob(token.split('.')[1]));
      } else if (response.access_token) {
        token = response.access_token;
        // Puedes realizar una llamada a la API de Google para obtener la información del usuario usando el access_token si es necesario
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        userInfo = await userResponse.json();
      }

      // Enviar el token al servidor para su verificación
      
      const serverResponse = await fetch('http://localhost:3001/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (serverResponse.ok) {
        const serverData = await serverResponse.json(); // Lee los datos del servidor
        const { token: jwtToken } = serverData; // Desestructura el token del JSON

        // Almacenar el token JWT en localStorage
        localStorage.setItem('authToken', jwtToken);

        // Opcionalmente, decodificar el token para mostrar datos del usuario
        const decodedToken = jwtDecode(jwtToken);
        console.log("Identificador único de Google: ", decodedToken.google_uid);
        console.log("Nombre: ", decodedToken.given_name);
        console.log("Apellido: ", decodedToken.family_name);
        console.log("Nombre completo: ", decodedToken.name);
        console.log("Email: ", decodedToken.email);
        console.log("¿Email verificado?: ", decodedToken.email_verified ? 'Si' : 'No');
        console.log("Imagen de perfil URL: ", decodedToken.picture);
        console.log('Datos del servidor:', serverData);

      } else if (!serverResponse.ok) {
        throw new Error('Error en la verificación del token en el servidor');
      }


      // Aquí puedes manejar la respuesta del servidor (guardar el token JWT, redirigir al usuario, etc.)

    } catch (error) {
      console.error('Error al obtener la información del usuario o al llamar a la API de Google:', error);
    }
  };

  const handleError = (error) => {
    console.log('Inicio de sesión fallido');
    console.log(error);
    // maneja el error del inicio de sesión
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
      {type === "default" &&
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
      }

      {type === "custom" &&
        <button
          className='btn btn-light google-login'
          onClick={() => loginWithGoogle()}>
          <i className="bi bi-google pe-1" />
          Continuar con Google
        </button>
      }

      {type === "onetap" &&
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handleSuccess(credentialResponse);
          }}
          onError={(error) => {
            console.log('Inicio de sesión One Tap fallido');
            handleError(error);
          }}
          useOneTap
        />
      }
    </>
  );
}

export default GoogleAuth;
