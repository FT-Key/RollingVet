import { deleteServerData, fetchServerData, postServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

export async function getUsers() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const rawData = await fetchServerData(apiUrl, "/usuarios");
  // Convertir fechaNacimiento, ultimoIngreso, creadoEn y actualizadoEn de string a Date
  const data = rawData.map((user) => ({
    ...user,
    fechaNacimiento: new Date(user.fechaNacimiento),
    ultimoIngreso: new Date(user.ultimoIngreso),
    creadoEn: new Date(user.creadoEn),
    actualizadoEn: new Date(user.actualizadoEn),
  }));
  return data;
}

export async function getOneUser(userId) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const rawData = await fetchServerData(apiUrl, `/usuarios/${userId}`);
  // Convertir fechaNacimiento, ultimoIngreso, creadoEn y actualizadoEn de string a Date
  const data = {
    ...rawData,
    fechaNacimiento: new Date(rawData.fechaNacimiento),
    ultimoIngreso: new Date(rawData.ultimoIngreso),
    creadoEn: new Date(rawData.creadoEn),
    actualizadoEn: new Date(rawData.actualizadoEn),
  };
  return data;
}

export async function addToCart(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local
  if (token) {
    try {
      await postServerData(
        apiUrl, // Tu dominio
        `/favncart/carrito/agregar/${idProducto}`,
        {}, // No necesitas un body para agregar al carrito
        token
      );
    } catch (error) {
      console.error("Error agregando producto al carrito:", error);
    }
  } else {
    console.log("No se encontro token de autorización");
  }
}

export async function addToFav(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local
  if (token) {
    try {
      await postServerData(
        apiUrl, // Tu dominio
        `/favncart/fav/agregar/${idProducto}`,
        {}, // No necesitas un body para agregar al carrito
        token
      );
    } catch (error) {
      console.error("Error agregando producto a favoritos:", error);
    }
  } else {
    console.log("No se encontro token de autorización");
  }
}

export async function getCart() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local
  if (token) {
    try {
      const cart = await fetchServerData(apiUrl, `/favncart/carrito`, token); // Pasar el token a fetchServerData
      return cart;
    } catch (error) {
      console.error("Error al obtener carrito del servidor", error);
    }
  } else {
    console.log("No se encontró token de autorización");
  }
}

export async function getFavs() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local
  if (token) {
    try {
      const favs = await fetchServerData(apiUrl, `/favncart/fav`, token); // Pasar el token a fetchServerData
      return favs;
    } catch (error) {
      console.error("Error al obtener favoritos del servidor", error);
    }
  } else {
    console.log("No se encontró token de autorización");
  }
}

export async function removeFromCart(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local
  if (token) {
    try {
      await deleteServerData(
        apiUrl, // Tu dominio
        `/favncart/carrito/quitar/${idProducto}`,
        token
      );
    } catch (error) {
      console.error("Error quitando producto del carrito:", error);
    }
  } else {
    console.log("No se encontro token de autorización");
  }
}

export async function removeFromFavs(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local
  if (token) {
    try {
      await deleteServerData(
        apiUrl, // Tu dominio
        `/favncart/fav/quitar/${idProducto}`,
        token
      );
    } catch (error) {
      console.error("Error quitando producto de favoritos:", error);
    }
  } else {
    console.log("No se encontro token de autorización");
  }
}



export async function uploadProfileImage(userId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    // Llamar a postServerData para subir la imagen
    const response = await postServerData(apiUrl, `/usuarios/agregarFotoPerfil/${userId}`, body);

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Error al subir la imagen");
    }

    // Si la respuesta es exitosa, obtener los datos
    const data = await response.json();

    return {
      success: true,
      data,  // Devuelve los datos de la respuesta
      message: "Imagen subida exitosamente",
    };
  } catch (error) {
    // En caso de error, devolver un objeto con el mensaje de error
    return {
      success: false,
      data: null,
      message: error.message || "Error desconocido al subir la imagen",
    };
  }
}
