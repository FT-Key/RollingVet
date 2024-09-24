import { fetchServerData, postServerData, putServerData, deleteServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

// Obtener todos los planes con paginación
export async function getPlanes(page, limit) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const rawData = await fetchServerData(apiUrl, `/planes?${page ? `page=${page}&` : ''}${limit ? `limit=${limit}` : ''}`);

  return {
    planes: rawData.planes,
    ...(rawData.totalPlanes ? {
      pagination: {
        totalPlanes: rawData.totalPlanes,
        page: rawData.page,
        limit: rawData.limit
      }
    } : {})
  };
}

// Obtener un plan específico por ID
export async function getOnePlan(planId) {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${apiUrl}/planes/${planId}`);

    if (!response.ok) {
      throw new Error("Error fetching plan data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching plan:", error);
    return null;
  }
}

// Crear un nuevo plan (solo para admin)
export async function postPlan(planData) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken(); // Obtén el token del almacenamiento local

  if (token) {
    try {
      const response = await postServerData(apiUrl, '/planes', planData, token);
      return response;
    } catch (error) {
      console.error("Error creando plan:", error);
      throw error;
    }
  } else {
    console.error("No se encontró token de autorización");
  }
}

// Actualizar un plan existente (solo para admin)
export async function putPlan(planId, planData) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  if (token) {
    try {
      const response = await putServerData(apiUrl, `/planes/${planId}`, planData, token);
      return response;
    } catch (error) {
      console.error("Error actualizando plan:", error);
      throw error;
    }
  } else {
    console.error("No se encontró token de autorización");
  }
}

// Eliminar un plan (solo para admin)
export async function deletePlan(planId) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  if (token) {
    try {
      const response = await deleteServerData(apiUrl, `/planes/${planId}`, token);
      return response;
    } catch (error) {
      console.error("Error eliminando plan:", error);
      throw error;
    }
  } else {
    console.error("No se encontró token de autorización");
  }
}

export async function comprarPlan(planSeleccionado, mascotaSeleccionada, returnUrl) {
  const apiUrl = import.meta.env.VITE_API_URL; // Asegúrate de tener la variable de entorno configurada
  const token = getToken(); // Obtén el token del almacenamiento local

  try {
    // Preparamos el cuerpo de la solicitud con los datos necesarios
    const body = {
      planSeleccionado,
      mascotaSeleccionada,
      returnUrl
    };

    // Usamos la función putServerData para hacer la solicitud PUT al servidor
    const response = await putServerData(apiUrl, `/planes/comprarPlan`, body, token);

    // Devolvemos la URL generada por Mercado Pago para redirigir al usuario
    return response.url;
  } catch (error) {
    console.error("Error en la compra del plan:", error);
    throw error;
  }
}