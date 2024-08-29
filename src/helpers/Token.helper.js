import { jwtDecode } from 'jwt-decode'; // Necesitas instalar la librería jwt-decode

export const isTokenValid = (token) => {
  if (!token) return false; // Verifica si el token está presente

  try {
    const decoded = jwtDecode(token); // Decodifica el token sin verificar firma
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos

    if (decoded.exp < currentTime) {
      // Token ha expirado
      console.log("Sesión expirada.")
      return false;
    }

    // Token válido
    return true;
  } catch (error) {
    // Error al decodificar o token inválido
    return false;
  }
}

// Obtener el token del sessionStorage con manejo de errores
export function getToken() {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.warn("No se encontró el token de autorización");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error al obtener el token de autorización:", error);
    return null;
  }
}

// Guardar el token en sessionStorage con manejo de errores
export function setToken(token) {
  try {
    if (!token) {
      throw new Error("Token vacío o no válido");
    }
    sessionStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Error al guardar el token de autorización:", error);
  }
}

// Eliminar el token del sessionStorage con manejo de errores
export function removeToken() {
  try {
    sessionStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error al eliminar el token de autorización:", error);
  }
}

