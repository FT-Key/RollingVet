import { fetchServerData, postServerData, putServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

export async function getProducts(page, limit) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const rawData = await fetchServerData(apiUrl, `/productos?${page ? `page=${page}&` : ''}${limit ? `limit=${limit}` : ''}`);

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

    if (data.releaseDate) {
      data.releaseDate = new Date(data.releaseDate);
    }

    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function postProduct(body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  if (token) {
    try {
      await postServerData(
        apiUrl,
        `/productos`,
        body,
        token
      );
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  }
}

export async function putProduct(productId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  if (token) {
    try {
      const response = await putServerData(
        apiUrl,
        `/productos/${productId}`,
        body,
        token
      );

      return response;
    } catch (error) {
      console.error("Error editando producto:", error);
    }
  }
}

export async function uploadProductImage(productId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  try {
    const response = await postServerData(apiUrl, `/productos/agregarImagen/${productId}`, body, token);

    if (!response.producto) {
      const errorData = await response.msg;
      throw new Error(errorData || "Error al subir la imagen");
    }

    const data = await response.producto;

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