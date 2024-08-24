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