import {
  //Productos
  validarNombreProducto,
  validarDescripcion,
  validarPrecio,
  validarStock,
  validarFecha,
  validarCategoria,
  validarImagenURL,
  validarProveedor,
  validarCodigoDeBarras,
  validarCalificaciones,
  validarGarantia,
  validarDescuento,
  //Usuarios
  validarNombreUsuario,
  /* validarContraseniaUsuario,
  validarContraseniaUsuarioGoogle, */
  validarCorreoElectronico,
  validarNombre,
  validarApellido,
  validarDireccion,
  validarCalle,
  validarCiudad,
  validarEstado,
  validarCodigoPostal,
  validarTelefono,
  validarPreferencias,
  validarPreguntasDeSeguridad,
  validarRespuesta,
  validarBiografia,
  validarEnlacesRedesSociales,
  validarSelect,
  validarFotoPerfil,
  validarNombreContacto,
  validarEmailContacto,
  validarTelefonoContacto,
  validarAsuntoContacto,
  validarMensajeContacto,
  validarNombreAnimal,
  validarTipoAnimal,
  validarRazaAnimal,
  validarEdadAnimal,
  validarDescripcionAnimal,
  validarPesoAnimal,
  validarGeneroAnimal,
  validarImagenAnimal,
  esComentarioValido,
  esCalificacionValida,
  validarContraseniaUsuario,
  //Animales

} from "../helpers/Validations";

import {
  ESTADOS_SUSCRIPCION,
  IDIOMAS,
  PAISES,
  PREGUNTAS_SEGURIDAD,
  REGIONES,
  ROLES,
  TEMAS,
} from "../utils/usersConst.utils";

export function validateUserFields(data) {
  let validationErrors = {};

  if (!validarNombreUsuario(data.nombreUsuario)) {
    validationErrors.nombreUsuario = "Nombre de usuario inválido";
  }

  if (!validarCorreoElectronico(data.email)) {
    validationErrors.email = "Email inválido";
  }

  /* if (data.tipoRegistro == "normal") {
    if (!validarContraseniaUsuario(data.contrasenia)) {
      validationErrors.contrasenia = "Contraseña inválida";
    }
  } else if (data.tipoRegistro == "google") {
    if (!validarContraseniaUsuarioGoogle(data.contrasenia)) {
      validationErrors.contrasenia = "Contraseña inválida";
    }
  } */

  if (!validarNombre(data.nombre)) {
    validationErrors.nombre = "Nombre inválido";
  }

  if (!validarApellido(data.apellido)) {
    validationErrors.apellido = "Apellido inválido";
  }

  if (data.fotoPerfil && !validarFotoPerfil(data.fotoPerfil)) {
    validationErrors.fotoPerfil = "Foto de perfil inválida";
  }

  if (data.direccion && validarDireccion(data.direccion)) {
    if (!validarCalle(data.direccion.calle)) {
      validationErrors.calle = "Calle inválida";
    }

    if (!validarCiudad(data.direccion.ciudad)) {
      validationErrors.ciudad = "Ciudad inválida";
    }

    if (!validarEstado(data.direccion.estado)) {
      validationErrors.estado = "Estado inválido";
    }

    if (!validarCodigoPostal(data.direccion.codigoPostal)) {
      validationErrors.codigoPostal = "Código postal inválido";
    }

    if (!validarSelect(data.direccion.pais, PAISES)) {
      validationErrors.pais = "País inválido";
    }
  } else if (data.direccion && validarDireccion(data.direccion)) {
    validationErrors.direccion = "Dirección inválida";
  }

  if (data.telefono && !validarTelefono(data.telefono)) {
    validationErrors.telefono = "Teléfono inválido";
  }

  if (validarPreferencias(data.preferencias)) {
    if (!validarSelect(data.preferencias.idioma, IDIOMAS)) {
      validationErrors.idioma = "Idioma inválido";
    }

    if (!validarSelect(data.preferencias.tema, TEMAS)) {
      validationErrors.tema = "Tema inválido";
    }
  } else {
    validationErrors.preferencias = "Preferencias inválidas";
  }

  if (data.preguntasSeguridad) {
    data.preguntasSeguridad.forEach((conjunto) => {
      if (conjunto && validarPreguntasDeSeguridad(conjunto)) {
        if (!validarSelect(conjunto.pregunta, PREGUNTAS_SEGURIDAD)) {
          validationErrors.pregunta = "Pregunta de seguridad inválida";
        }

        if (!validarRespuesta(conjunto.respuesta)) {
          validationErrors.respuesta = "Respuesta inválida";
        }
      } else {
        validationErrors.preguntasSeguridad =
          "Campo incompleto en pregunta de seguridad";
      }
    });
  }

  if (data.biografia && data.biografia != '' && !validarBiografia(data.biografia)) {
    validationErrors.biografia = "Biografía inválida";
  }

  if (data.enlacesRedesSociales && !validarEnlacesRedesSociales(data.enlacesRedesSociales)) {
    validationErrors.enlacesRedesSociales =
      "Enlaces de redes sociales inválidos";
  }

  if (!validarSelect(data.estadoSuscripcion, ESTADOS_SUSCRIPCION)) {
    validationErrors.estadoSuscripcion = "Estado de suscripción inválido";
  }

  if (data.region && !validarSelect(data.region, REGIONES)) {
    validationErrors.region = "Región inválida";
  }

  if (!validarSelect(data.rol, ROLES)) {
    validationErrors.rol = "Rol inválido";
  }

  return validationErrors;
}

export function validateProductFields(data) {
  let validationErrors = {};

  if (!validarNombreProducto(data.nombre)) {
    validationErrors.nombre = "Nombre de producto inválido";
  }

  if (!validarPrecio(data.precio)) {
    validationErrors.precio = "Precio inválido";
  }

  if (!validarDescripcion(data.descripcion)) {
    validationErrors.descripcion = "Descripción inválida";
  }

  if (!validarCategoria(data.categoria)) {
    validationErrors.categoria = "Categoría inválida";
  }

  if (!validarStock(data.cantidadEnStock)) {
    validationErrors.cantidadEnStock = "Stock inválido";
  }

  if (!validarProveedor(data.proveedor)) {
    validationErrors.proveedor = "Proveedor inválida";
  }

  if (!validarCodigoDeBarras(data.codigoDeBarras)) {
    validationErrors.codigoDeBarras = "codigo de barras inválido";
  }

  if (data.imagenUrl && !validarImagenURL(data.imagenUrl)) {
    validationErrors.imagenUrl = "URL de la imagen inválida";
  }

  if (!validarCalificaciones(data.calificaciones)) {
    validationErrors.calificaciones = "Calificaciones inválidas";
  }

  if (!validarGarantia(data.garantia)) {
    validationErrors.garantia = "Garantía inválida";
  }

  if (!validarFecha(data.fechaDeIngreso)) {
    validationErrors.fechaDeIngreso = "Fecha de ingreso inválida";
  }

  if (!validarDescuento(data.descuento)) {
    validationErrors.descuento = "Descuento inválido";
  }

  return validationErrors;
}

export function validateAnimalFields(data) {
  const errors = {};

  // Valida el nombre
  if (!validarNombreAnimal(data.nombre)) {
    errors.nombre = "El nombre debe contener al menos 2 caracteres y solo letras.";
  }

  // Valida el tipo (por ejemplo, perro, gato, etc.)
  if (!validarTipoAnimal(data.tipo)) {
    errors.tipo = "El tipo de animal es obligatorio y debe ser válido (e.g., perro, gato).";
  }

  // Valida la raza
  if (data.raza && !validarRazaAnimal(data.raza)) {
    errors.raza = "La raza debe contener al menos 3 caracteres y solo letras.";
  }

  // Valida la edad (debe ser un número positivo)
  if (!validarEdadAnimal(data.edad)) {
    errors.edad = "La edad debe ser un número positivo.";
  }

  // Valida la descripción (opcional, pero si existe debe ser válida)
  if (data.descripcion && !validarDescripcionAnimal(data.descripcion)) {
    errors.descripcion = "La descripción debe tener entre 10 y 200 caracteres.";
  }

  // Valida el peso (debe ser un número positivo)
  if (!validarPesoAnimal(data.peso)) {
    errors.peso = "El peso debe ser un número positivo.";
  }

  // Valida el género (debe ser 'Macho' o 'Hembra')
  if (!validarGeneroAnimal(data.genero)) {
    errors.genero = "El género debe ser 'Macho' o 'Hembra'.";
  }

  // Valida la imagen (opcional, pero si existe debe ser una URL válida)
  if (!data.imagen?.size) {
    if (data.imagen && !validarImagenAnimal(data.imagen)) {
      errors.imagen = "La URL de la imagen no es válida.";
    }
  }

  // Retorna los errores, si el objeto está vacío, no hay errores
  return errors;
}

export function validateContactFields(data) {
  let erroresValidacion = {};

  if (!validarNombreContacto(data.nombre)) {
    erroresValidacion.nombre = "Nombre inválido. Debe contener solo letras y al menos 4 caracteres.";
  }

  if (!validarEmailContacto(data.email)) {
    erroresValidacion.email = "Email inválido.";
  }

  if (!validarTelefonoContacto(data.telefono)) {
    erroresValidacion.telefono = "Teléfono inválido. Debe contener solo números.";
  }

  if (!validarAsuntoContacto(data.asunto)) {
    erroresValidacion.asunto = "El asunto debe tener al menos 3 caracteres.";
  }

  if (!validarMensajeContacto(data.mensaje)) {
    erroresValidacion.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  }

  return erroresValidacion;
}

export function validateCommentsFields(data) {
  const errors = {};

  if (!esComentarioValido(data.texto)) {
    errors.texto = "El texto debe contener un mínimo de 10 carácteres y máximo de 300.";
  }

  if (!esCalificacionValida(data.calificacion)) {
    errors.calificacion = "La calificación debe ser un número del 0 al 5.";
  }

  return errors;
}

export function validateRegisterFields(data) {
  const errors = {};

  if (!validarNombreUsuario(data.userName)) {
    errors.userName = "El nombre de usuario debe tener entre 3 y 30 caracteres y puede incluir letras, números, guiones, puntos y guiones bajos.";
  }

  if (!validarCorreoElectronico(data.userEmail)) {
    errors.userEmail = "El email debe tener un formato válido (ejemplo@dominio.com) y contener entre 3 y 40 caracteres antes del símbolo '@'.";
  }

  if (!validarContraseniaUsuario(data.userPass)) {
    errors.userPass = "La contraseña debe tener entre 6 y 30 caracteres, incluir al menos una letra y un número.";
  }

  return errors;
}