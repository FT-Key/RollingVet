import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function getToken() {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error al obtener el token de autorización:", error);
    return null;
  }
}

export const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

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

export function removeToken() {
  try {
    sessionStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error al eliminar el token de autorización:", error);
  }
}