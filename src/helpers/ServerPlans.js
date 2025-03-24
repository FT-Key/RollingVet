import { fetchServerData, postServerData, putServerData, deleteServerData } from "./ServerCalling";
import { getToken } from "./Token.helper";

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

export async function postPlan(planData) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

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
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getToken();

  try {
    const body = {
      planSeleccionado,
      mascotaSeleccionada,
      returnUrl
    };

    const response = await putServerData(apiUrl, `/planes/comprarPlan`, body, token);

    return response.url;
  } catch (error) {
    console.error("Error en la compra del plan:", error);
    throw error;
  }
}