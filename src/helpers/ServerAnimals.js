import { deleteServerData, fetchServerData, postServerData, putServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

export async function getAnimals(page, limit, filters = {}) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const queryParams = new URLSearchParams();

  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);

  for (const key in filters) {
    if (filters[key] !== undefined && filters[key] !== null) {
      queryParams.append(key, filters[key]);
    }
  }

  const rawData = await fetchServerData(apiUrl, `/animales?${queryParams.toString()}`);

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

export async function getOneAnimal(animalId) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const rawData = await fetchServerData(apiUrl, `/animales/${animalId}`);

  const data = {
    ...rawData,
    fechaNacimiento: rawData.fechaNacimiento ? new Date(rawData.fechaNacimiento) : null,
    ultimoIngreso: rawData.ultimoIngreso ? new Date(rawData.ultimoIngreso) : null,
    creadoEn: rawData.creadoEn ? new Date(rawData.creadoEn) : null,
    actualizadoEn: rawData.actualizadoEn ? new Date(rawData.actualizadoEn) : null,
  };
  return data;
}

export async function postAnimal(body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      await postServerData(
        apiUrl,
        `/animales`,
        body,
        token
      );
    } catch (error) {
      console.error("Error creando animal:", error);
    }
  }
}

export async function putAnimal(animalId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      await putServerData(
        apiUrl, 
        `/animales/${animalId}`,
        body,
        token
      );
    } catch (error) {
      console.error("Error editando animal:", error);
    }
  }
}

export async function deleteAnimal(animalId) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();
  if (token) {
    try {
      await deleteServerData(apiUrl, `/animales/${animalId}`, token);
    } catch (error) {
      console.error("Error eliminando animal:", error);
    }
  }
}

export async function uploadAnimalImage(animalId, body) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  try {
    const response = await postServerData(apiUrl, `/animales/agregarFotoAnimal/${animalId}`, body, token);

    if (!response.msg) {
      const errorData = response;
      throw new Error(errorData.msg || "Error al subir la imagen");
    }

    const data = await response.msg;

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || "Error desconocido al subir la imagen",
    };
  }
}

export async function createAnimal(body) {

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  if (token) {
    try {
      const response = await postServerData(apiUrl, `/animales/createAnimal`, body, token);
      return response;
    } catch (error) {
      console.error("Error creando mascota:", error);
    }
  }
}