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
  const [cantidades, setCantidades] = useState({}); // Estado para las cantidades de los productos en el carrito

  const updateCartQuantities = (productos = []) => {
    setCantidades((prevCantidades) => {
      const nuevasCantidades = { ...prevCantidades };
  
      // Si no hay productos en el carrito, vaciar el estado de cantidades
      if (productos.length === 0) {
        return {};
      }
  
      // Recorre los productos para inicializar o actualizar las cantidades
      productos.forEach((prod) => {
        if (!(prod._id in nuevasCantidades)) {
          nuevasCantidades[prod._id] = 1; // Inicializa la cantidad si no está definida
        }
      });
  
      return nuevasCantidades;
    });
  };  

  const handleCantidadChange = (id, nuevaCantidad) => {
    setCantidades((prevCantidades) => ({ ...prevCantidades, [id]: parseInt(nuevaCantidad) }));
  };

  useEffect(() => {
    const fetchCartAndFavs = async () => {
      try {
        if (updateMark === 'cart') {
          const cartData = await getCart();
          setCarrito(cartData?.productos || []);
          updateCartQuantities(cartData?.productos || []);
        }

        if (updateMark === 'fav') {
          const favsData = await getFavs();
          setFavoritos(favsData?.productos || []);
        }
      } catch (error) {
        console.error('Error al obtener carrito o favoritos:', error);
      }
    };

    fetchCartAndFavs();
  }, [updateMark, booleanUpdateMark]);

  useEffect(() => {
    const start = async () => {
      await checkToken();
      updateCartQuantities();
    }

    start();
  }, []);

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

  const loginContext = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setToken(token);
      setTokenExpiry(decodedToken.exp);

      // Limpiar carrito
      await clearCart();

      // Llamar a checkToken para establecer el temporizador
      checkToken();

    } catch (error) {
      console.error("Error al decodificar el token en loginContext:", error);
    }
  };

  const clearCart = async () => {
    try {
      const cartData = await getCart();
      if (cartData.productos.length > 0) {
        for (const singleCart of cartData.productos) {
          await removeFromCart(singleCart._id);
        }
      }
      setCarrito([]);
      setCantidades({});
      setUpdateMark('cart');
      setBooleanUpdateMark(prev => !prev);
    } catch (error) {
      console.error("Error al limpiar el carrito:", error);
    }
  };

  const logoutContext = async () => {
    try {
      setUser(null);
      setTokenExpiry(null);
      await clearCart();
      setCarrito([]);
      setFavoritos([]);
      setCantidades({});
      removeToken();
      await checkToken(); // Asegúrate de que checkToken no borre el token prematuramente
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logoutContext, loading, carrito, setCarrito, favoritos, setFavoritos, setUpdateMark, setBooleanUpdateMark, clearCart, cantidades, setCantidades, handleCantidadChange }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};