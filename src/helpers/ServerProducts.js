import { fetchServerData, postServerData } from "./ServerCalling";

export async function getProducts() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const rawData = await fetchServerData(apiUrl, "/productos");
  // Convertir releaseDate de string a Date
  const data = rawData.map((product) => ({
    ...product,
    releaseDate: new Date(product.releaseDate),
  }));
  return data;
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

export async function uploadProductImage(productId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    // Llamar a postServerData para subir la imagen
    const response = await postServerData(apiUrl, `/productos/agregarImagen/${productId}`, body);

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