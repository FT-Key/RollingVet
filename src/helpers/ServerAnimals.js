import { deleteServerData, fetchServerData, postServerData, putServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

// Obtener todos los animales con paginación
export async function getAnimals(page, limit) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  const rawData = await fetchServerData(apiUrl, `/animales?${page ? `page=${page}&` : ''}${limit ? `limit=${limit}` : ''}`, token);

  // Convertir las fechas a Date si existen
  const data = rawData.animales.map((animal) => ({
    ...animal,
    fechaNacimiento: animal.fechaNacimiento ? new Date(animal.fechaNacimiento) : null,
    ultimoIngreso: animal.ultimoIngreso ? new Date(animal.ultimoIngreso) : null,
    creadoEn: animal.creadoEn ? new Date(animal.creadoEn) : null,
    actualizadoEn: animal.actualizadoEn ? new Date(animal.actualizadoEn) : null,
  }));

  return {
    animales: data,
    ...(rawData.totalAnimales ? {
      pagination: {
        totalAnimales: rawData.totalAnimales,
        page: rawData.page,
        limit: rawData.limit
      }
    } : {})
  };
}

// Obtener un solo animal por ID
export async function getOneAnimal(animalId) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  const rawData = await fetchServerData(apiUrl, `/animales/${animalId}`, token);

  // Convertir las fechas a Date si existen
  const data = {
    ...rawData,
    fechaNacimiento: rawData.fechaNacimiento ? new Date(rawData.fechaNacimiento) : null,
    ultimoIngreso: rawData.ultimoIngreso ? new Date(rawData.ultimoIngreso) : null,
    creadoEn: rawData.creadoEn ? new Date(rawData.creadoEn) : null,
    actualizadoEn: rawData.actualizadoEn ? new Date(rawData.actualizadoEn) : null,
  };
  return data;
}

export async function putAnimal(animalId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local
  if (token) {
    try {
      await putServerData(
        apiUrl, // Tu dominio
        `/animales/${animalId}`,
        body, // No necesitas un body para agregar al carrito
        token
      );
    } catch (error) {
      console.error("Error agregando producto al carrito:", error);
    }
  } else {
    console.log("No se encontro token de autorización");
  }
}

// Subir una imagen de perfil de un animal
export async function uploadAnimalImage(animalId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  try {
    // Llamar a postServerData para subir la imagen
    const response = await postServerData(apiUrl, `/animales/agregarFotoAnimal/${animalId}`, body, token);

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