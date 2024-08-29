import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";
import { getCart, getFavs, removeFromCart } from "../helpers/ServerUsers";
import { getToken, setToken, removeToken } from "../helpers/Token.helper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [tokenExpiry, setTokenExpiry] = useState(null); // Tiempo de expiración del token
  const [carrito, setCarrito] = useState([]); // Estado del carrito
  const [favoritos, setFavoritos] = useState([]); // Estado de favoritos  
  const [updateMark, setUpdateMark] = useState();
  const [booleanUpdateMark, setBooleanUpdateMark] = useState(false);

  const checkToken = async () => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp >= currentTime) {
          setUser(decodedToken);
          setTokenExpiry(decodedToken.exp);

          // Cargar el carrito y favoritos al autenticarse
          const cartData = await getCart();
          const favsData = await getFavs();
          setCarrito(cartData.productos || []);
          setFavoritos(favsData.productos || []);

          // Configurar el tiempo de expiración
          const timeToExpire = (decodedToken.exp - currentTime) * 1000;
          console.log(
            "Tiempo restante: ",
            `${Math.floor(timeToExpire / (1000 * 60 * 60))}h`,
            `${Math.floor((timeToExpire % (1000 * 60 * 60)) / (1000 * 60))}m`,
            `${Math.floor((timeToExpire % (1000 * 60)) / 1000)}s`
          );
          setTimeout(checkToken, timeToExpire); // Verificar token antes de expirar

        } else {
          removeToken();
          setUser(null);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        removeToken();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    const fetchCartAndFavs = async () => {
      try {
        if (updateMark === "cart") {
          const nuevoCarrito = await getCart();
          const listaCarrito = nuevoCarrito?.productos || []; // Usar optional chaining para evitar errores
          setCarrito(listaCarrito);
        } else if (updateMark === "fav") {
          const nuevosFavoritos = await getFavs();
          const listaFavoritos = nuevosFavoritos?.productos || []; // Usar optional chaining para evitar errores
          setFavoritos(listaFavoritos);
        }
      } catch (error) {
        console.error("Error al obtener carrito o favoritos:", error);
      }
    };

    fetchCartAndFavs();
  }, [updateMark, booleanUpdateMark]);

  const loginContext = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setToken(token);
      setTokenExpiry(decodedToken.exp);

      // Cargar carrito y favoritos al iniciar sesión
      const cartData = await getCart();
      const favsData = await getFavs();

      // Eliminar cada producto del carrito
      for (const singleCart of cartData.productos) {
        await removeFromCart(singleCart._id);
      }

      setCarrito([]);
      setFavoritos(favsData.productos || []);

      // Llamar a checkToken para establecer el temporizador
      checkToken();

    } catch (error) {
      console.error("Error al decodificar el token en loginContext:", error);
    }
  };

  const logoutContext = () => {
    setUser(null);
    setTokenExpiry(null);
    setCarrito([]);
    setFavoritos([]);
    removeToken();

    // Llamar a checkToken para actualizar bien el contexto
    checkToken();
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logoutContext, loading, carrito, setCarrito, favoritos, setFavoritos, setUpdateMark, setBooleanUpdateMark }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};