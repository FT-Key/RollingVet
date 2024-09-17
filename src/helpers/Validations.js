// Usuarios

export function validarNombreUsuario(nombreUsuario) {
  // Expresión regular
  const regex =
    /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ])[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\d\-_\.]{3,30}$/;

  // Comprobar si el valor de nombreUsuario cumple con la expresión regular
  return regex.test(nombreUsuario);
}

/* export function validarContraseniaUsuario(contraseniaUsuario) {
  // Expresión regular
  const regex =
    /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ])(?=.*\d)[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\d_]{6,30}$/;

  // Comprobar si el valor de contraseniaUsuario cumple con la expresión regular
  return regex.test(contraseniaUsuario);
}

export function validarContraseniaUsuarioGoogle(contraseniaUsuarioGoogle) {
  // Expresión regular
  const regex = /^\d+$/;

  // Comprobar si el valor de contraseniaUsuarioGoogle cumple con la expresión regular
  return regex.test(contraseniaUsuarioGoogle);
} */

export function validarCorreoElectronico(correoUsuario) {
  // Expresión regular
  const regex = /^[a-zA-Z0-9_]{3,40}@[a-zA-Z0-9_]+\.[a-zA-Z0-9]+$/;

  // Comprobar si el valor de correoUsuario cumple con la expresión regular
  return regex.test(correoUsuario);
}

export function validarNombre(nombre) {
  // Expresión regular para validar que el nombre solo contenga letras y tenga al menos 2 caracteres
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]{2,}$/;
  return nombreRegex.test(nombre);
}

export function validarApellido(apellido) {
  // Expresión regular para validar que el apellido solo contenga letras y tenga al menos 2 caracteres
  const apellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]{2,}$/;
  return apellidoRegex.test(apellido);
}

export function validarFotoPerfil(cadena) {
  // Expresión regular para URLs absolutas
  const regexURL = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  // Expresión regular para rutas locales
  const regexLocal = /^(\.\/|\.\.\/).*\/.*\.(?:png|jpg|jpeg|gif|webp)$/i;
  // Expresión regular para rutas google
  const regexGoogle = /^https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\/._-]+=[a-zA-Z0-9=-]+$/i;
  // Expresión regular para URLs de via.placeholder.com con tamaños entre 100 y 5000
  const regexPlaceholder = /^https:\/\/via\.placeholder\.com\/([1-9]\d{2,3}|10000)x([1-9]\d{2,3}|10000)$/;
  const regexPicsum = /^https:\/\/picsum\.photos\/(?:id\/\d+\/)?(?:seed\/\w+\/)?(\d{2,4})(?:\/(\d{2,4}))?(?:\.(?:jpg|webp))?(?:\/?(?:\?(?:random=\d+|grayscale|blur=\d+|blur|grayscale&blur=\d+)|&?random=\d+|&?grayscale|&?blur=\d+|&?blur)*)?$/i;

  // Comprobar si la cadena cumple con alguna de las tres expresiones regulares
  return regexURL.test(cadena) || regexLocal.test(cadena) || regexPlaceholder.test(cadena) || regexPicsum.test(cadena) || regexGoogle.test(cadena);
}

export function validarDireccion(direccion) {
  // Implementa la validación para la dirección
  const { calle, ciudad, estado, codigoPostal, pais } = direccion;
  return calle && ciudad && estado && codigoPostal && pais;
}

export function validarCalle(calle) {
  const regex = /^[A-Za-z0-9\s,'-]*$/;
  return regex.test(calle);
}

export function validarCiudad(ciudad) {
  const regex = /^[a-zA-Z\s]*$/;
  return regex.test(ciudad);
}

export function validarEstado(estado) {
  const regex = /^[a-zA-Z\s]*$/;
  return regex.test(estado);
}

export function validarCodigoPostal(codigoPostal) {
  const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;
  return regex.test(codigoPostal);
}

export function validarTelefono(telefono) {
  // Implementa la validación para el teléfono
  const regex = /^[0-9]{10,15}$/;
  const testPhone = /^\d{3}-\d{4}$/;
  return regex.test(telefono) || testPhone.test(telefono);
}

export function validarPreferencias(preferencias) {
  // Implementa la validación para las preferencias
  const { idioma, tema } = preferencias;
  return idioma && tema;
}

export function validarPreguntasDeSeguridad(preguntasSeguridad) {
  // Implementa la validación para las preferencias
  const { pregunta, respuesta } = preguntasSeguridad;

  return Boolean(pregunta && respuesta);
}

export function validarRespuesta(respuesta) {
  const regex = /^[a-zA-Z0-9\s]*$/;
  return regex.test(respuesta);
}

export function validarBiografia(biografia) {
  // Implementa la validación para la biografía
  return biografia && biografia.length <= 500;
}

export function validarEnlacesRedesSociales(enlacesRedesSociales) {
  // Implementa la validación para los enlaces de redes sociales
  const { twitter, linkedin } = enlacesRedesSociales;
  const regex = /^(https?:\/\/)?([\w\-]+)\.([a-z]{2,6})(\/[\w\-]*)*$/i;
  return regex.test(twitter) && regex.test(linkedin);
}

export function validarSelect(opcion, opcionesValidas) {
  // Implementa la validación para la región
  return opcionesValidas.includes(opcion);
}

// Productos

export function validarNombreProducto(cadena) {
  // Expresión regular mejorada
  const regex = /^[A-ZÁÉÍÓÚÑÜ0-9][A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-:()!?]*$/;

  // Comprobar si el valor de cadena cumple con la expresión regular
  return regex.test(cadena);
}

export function validarPrecio(cadena) {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(cadena);
}

export function validarDescripcion(cadena) {
  // Expresión regular para descripciones
  const regex = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-:()!?."%&$#@\n]*$/;

  // Comprobar si el valor de cadena cumple con la expresión regular
  return regex.test(cadena);
}

export function validarCategoria(cadena) {
  const regex = /^([A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-]+,)*[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-]+$/;
  return regex.test(cadena);
}

export function validarStock(cadena) {
  const regex = /^\d+$/;
  return regex.test(cadena);
}

export function validarMarca(cadena) {
  const regex = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü\s,'&.-]+$/;
  return regex.test(cadena);
}

export function validarModelo(cadena) {
  const regex = /^[A-Za-z0-9\s,'-]+$/;
  return regex.test(cadena);
}

export function validarImagenURL(cadena) {
  // Expresión regular para URLs absolutas
  const regexURL = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  // Expresión regular para rutas locales
  const regexLocal = /^(\.\/|\.\.\/).*\/.*\.(?:png|jpg|jpeg|gif|webp)$/i;
  // Expresión regular para URLs de via.placeholder.com con tamaños entre 100 y 5000
  const regexPlaceholder = /^https:\/\/via\.placeholder\.com\/([1-9]\d{2,3}|10000)(x([1-9]\d{2,3}|10000))?$/;
  const regexPicsum = /^https:\/\/picsum\.photos\/(?:id\/\d+\/)?(?:seed\/\w+\/)?(\d{2,4})(?:\/(\d{2,4}))?(?:\.(?:jpg|webp))?(?:\/?(?:\?(?:random=\d+|grayscale|blur=\d+|blur|grayscale&blur=\d+)|&?random=\d+|&?grayscale|&?blur=\d+|&?blur)*)?$/i;

  // Comprobar si la cadena cumple con alguna de las tres expresiones regulares
  return regexURL.test(cadena) || regexLocal.test(cadena) || regexPlaceholder.test(cadena) || regexPicsum.test(cadena);
}

export function validarCalificaciones(cadena) {
  // La expresión regular acepta números enteros del 1 al 10 y números con un decimal usando punto o coma
  const regex = /^(?:[0-4](?:,[0-9])?|5)$/;
  return regex.test(cadena);
}

export function validarGarantia(cadena) {
  console.log("ingresa: ", cadena);

  // Acepta garantía en años (e.g., "2 años"), en meses (e.g., "6 meses"), o 'Sin garantía'
  const regex = /^\d{1,2}\s*(mes|meses|año|años)$/;

  // Verifica si la cadena es 'Sin garantía'
  if (cadena.toLowerCase() === 'sin garantía' || cadena.toLowerCase() === 'sin garantia') {
    return true;
  }

  // Asegúrate de que el número de meses esté entre 1 y 12
  const meses = cadena.match(/^(\d{1,2})\s*(mes|meses)$/);
  if (meses) {
    const numMeses = parseInt(meses[1], 10);
    if (numMeses >= 1 && numMeses <= 12) {
      return true;
    }
  }

  // Verifica si la cadena coincide con la expresión regular general
  return regex.test(cadena);
}

export function validarFecha(fecha) {
  const fechaTest = new Date();
  if (Object.prototype.toString.call(fechaTest) !== "[object Date]" || isNaN(fechaTest)) {
    return false; // No es un objeto Date válido
  }
  return true; // Es una fecha válida de JavaScript
}

export function validarDescuento(cadena) {
  // Acepta un descuento en formato de porcentaje (0% a 100%) o como valor numérico con hasta 2 decimales
  const regex = /^([0-9]|[1-9][0-9]|100)(\.\d{1,2})?%?$/;
  return regex.test(cadena);
}