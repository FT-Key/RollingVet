import { fetchServerData, postServerData, putServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

export async function getProducts(page, limit) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const rawData = await fetchServerData(apiUrl, `/productos?${page ? `page=${page}&` : ''}${limit ? `limit=${limit}` : ''}`);

  // Convertir releaseDate de string a Date
  const data = rawData.productos.map((product) => ({
    ...product,
    releaseDate: new Date(product.releaseDate),
  }));

  return {
    productos: data,
    ...(rawData.totalProductos ? {
      pagination: {
        totalProductos: rawData.totalProductos,
        page: rawData.page,
        limit: rawData.limit
      }
    } : {})
  };
}

export async function getOneProduct(productId) {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${apiUrl}/productos/${productId}`);

    if (!response.ok) {
      throw new Error("Error fetching product data");
    }

    const data = await response.json();

    // Convertir releaseDate de string a Date, si existe
    if (data.releaseDate) {
      data.releaseDate = new Date(data.releaseDate);
    }

    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // o puedes manejar el error de otra forma, dependiendo de tu aplicación
  }
}

export async function postProduct(body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local

  if (token) {
    try {
      await postServerData(
        apiUrl, // Tu dominio
        `/productos`,
        body,
        token
      );
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  } else {
    console.log("No se encontro token de autorización");
  }
}

export async function putProduct(productId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local

  if (token) {
    try {
      const response = await putServerData(
        apiUrl, // Tu dominio
        `/productos/${productId}`,
        body,
        token
      );

      return response;
    } catch (error) {
      console.error("Error editando producto:", error);
    }
  } else {
    console.log("No se encontro token de autorización");
  }
}

export async function uploadProductImage(productId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local

  try {
    // Llamar a postServerData para subir la imagen
    const response = await postServerData(apiUrl, `/productos/agregarImagen/${productId}`, body, token);

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.producto) {
      const errorData = await response.msg;
      throw new Error(errorData || "Error al subir la imagen");
    }

    // Si la respuesta es exitosa, obtener los datos
    const data = await response.producto;

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