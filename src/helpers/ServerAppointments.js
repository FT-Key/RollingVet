import { fetchServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

export async function getAppointments(page, limit) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

<<<<<<< HEAD
  const rawData = await fetchServerData(apiUrl, `/turnos?${page ? `page=${page}&` : ''}${limit ? `limit=${limit}` : ''}`, token);
=======
  const rawData = await fetchServerData(apiUrl, `/turnos/obtener?${page ? `page=${page}&` : ''}${limit ? `limit=${limit}` : ''}`, token);
>>>>>>> main

  return {
    fechaTurnos: rawData.fechaTurnos,
    ...(rawData.totalTurnos ? {
      pagination: {
        totalTurnos: rawData.totalTurnos,
        page: rawData.page,
        limit: rawData.limit
      }
    } : {})
  };
}

export async function getOneAppointment(fecha) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  try {
<<<<<<< HEAD
    const response = await fetchServerData(apiUrl, `/turnos/${fecha}`, token);
=======
    const response = await fetchServerData(apiUrl, `/turnos/obtener/${fecha}`, token);
>>>>>>> main

    if (!response._id) {
      throw new Error("Error fetching appointment data");
    }

    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}