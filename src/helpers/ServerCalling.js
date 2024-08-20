export const fetchServerData = async (dominio, ruta, token = '') => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

export const postServerData = async (dominio, ruta, body, token = "") => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al enviar datos:", error);
    throw error;
  }
};

export const putServerData = async (dominio, ruta, body, token = '') => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    throw error;
  }
};

export const deleteServerData = async (dominio, ruta, token = '') => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al eliminar datos:", error);
    throw error;
  }
};
