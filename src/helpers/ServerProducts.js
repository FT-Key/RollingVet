import { fetchServerData } from "./ServerCalling";

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
