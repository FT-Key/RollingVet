import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [tokenExpiry, setTokenExpiry] = useState(null); // Tiempo de expiración del token

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp >= currentTime) {
            setUser(decodedToken);
            setTokenExpiry(decodedToken.exp); // Establecer el tiempo de expiración

            // Calcular el tiempo restante
            const timeRemaining = decodedToken.exp - currentTime;

            // Mostrar el tiempo restante en formato horas:minutos:segundos
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = Math.floor(timeRemaining % 60);

            console.log(`Tiempo restante para que la sesión expire: ${hours}h ${minutes}m ${seconds}s`);

            // Limpiar el intervalo previo si existe
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            // Establecer intervalo basado en el tiempo restante
            intervalRef.current = setInterval(() => {
              checkToken(); // Revalidar el token
            }, timeRemaining * 1000); // Verificar en el momento de la expiración
          } else {
            localStorage.removeItem("authToken");
            setUser(null);
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Actualizar estado de carga al finalizar
    };

    const intervalRef = { current: null }; // Ref para guardar el intervalo

    checkToken(); // Verificar token al cargar el componente

    // Limpiar intervalos si el componente se desmonta
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loginContext = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      localStorage.setItem("authToken", token);
      setTokenExpiry(decodedToken.exp); // Actualizar el tiempo de expiración
    } catch (error) {
      console.error("Error al decodificar el token en loginContext:", error);
    }
  };

  const logoutContext = () => {
    setUser(null);
    setTokenExpiry(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logoutContext, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};