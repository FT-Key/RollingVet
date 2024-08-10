export const fetchServerData = async (dominio, ruta) => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
};

export const postServerData = async (dominio, ruta, body) => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al enviar datos:', error);
    throw error;
  }
};

export const putServerData = async (dominio, ruta, body) => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar datos:', error);
    throw error;
  }
};

export const deleteServerData = async (dominio, ruta) => {
  try {
    const response = await fetch(`${dominio}${ruta}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al eliminar datos:', error);
    throw error;
  }
};