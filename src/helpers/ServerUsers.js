import { deleteServerData, fetchServerData, postServerData, putServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

export async function getUsers(page, limit) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  const rawData = await fetchServerData(apiUrl, `/usuarios?${page ? `page=${page}&` : ''}${limit ? `limit=${limit}` : ''}`, token);

  const data = rawData.usuarios.map((user) => ({
    ...user,
    fechaNacimiento: new Date(user.fechaNacimiento),
    ultimoIngreso: new Date(user.ultimoIngreso),
    creadoEn: new Date(user.creadoEn),
    actualizadoEn: new Date(user.actualizadoEn),
  }));

  return {
    usuarios: data,
    ...(rawData.totalUsuarios ? {
      pagination: {
        totalUsuarios: rawData.totalUsuarios,
        page: rawData.page,
        limit: rawData.limit
      }
    } : {})
  };
}

export async function getOneUser(userId) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  const rawData = await fetchServerData(apiUrl, `/usuarios/${userId}`, token);
  const data = {
    ...rawData,
    fechaNacimiento: new Date(rawData.fechaNacimiento),
    ultimoIngreso: new Date(rawData.ultimoIngreso),
    creadoEn: new Date(rawData.creadoEn),
    actualizadoEn: new Date(rawData.actualizadoEn),
  };
  return data;
}

export async function putUser(userId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      const response = await putServerData(
        apiUrl,
        `/usuarios/${userId}`,
        body,
        token
      );

      return response;
    } catch (error) {
      console.error("Error agregando producto al carrito:", error);
    }
  }
}

export async function addToCart(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      await postServerData(
        apiUrl,
        `/favncart/carrito/agregar/${idProducto}`,
        {},
        token
      );
    } catch (error) {
      console.error("Error agregando producto al carrito:", error);
    }
  }
}

export async function addToFav(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      await postServerData(
        apiUrl,
        `/favncart/fav/agregar/${idProducto}`,
        {},
        token
      );
    } catch (error) {
      console.error("Error agregando producto a favoritos:", error);
    }
  }
}

export async function getCart() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      const cart = await fetchServerData(apiUrl, `/favncart/carrito`, token);
      return cart;
    } catch (error) {
      console.error("Error al obtener carrito del servidor", error);
    }
  }
}

export async function getFavs() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      const favs = await fetchServerData(apiUrl, `/favncart/fav`, token);
      return favs;
    } catch (error) {
      console.error("Error al obtener favoritos del servidor", error);
    }
  }
}

export async function removeFromCart(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      await deleteServerData(
        apiUrl,
        `/favncart/carrito/quitar/${idProducto}`,
        token
      );
    } catch (error) {
      console.error("Error quitando producto del carrito:", error);
    }
  }
}

export async function removeFromFavs(idProducto) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      await deleteServerData(
        apiUrl,
        `/favncart/fav/quitar/${idProducto}`,
        token
      );
    } catch (error) {
      console.error("Error quitando producto de favoritos:", error);
    }
  }
}

export async function uploadProfileImage(userId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await postServerData(apiUrl, `/usuarios/agregarFotoPerfil/${userId}`, body);

    if (!response.usuario) {
      const errorData = await response.msg;
      throw new Error(errorData || "Error al subir la imagen");
    }

    const data = await response.usuario;

    return {
      success: true,
      data,
      message: "Imagen subida exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || "Error desconocido al subir la imagen",
    };
  }
}
