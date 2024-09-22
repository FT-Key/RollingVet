import {
  //Productos
  validarNombreProducto,
  validarDescripcion,
  validarPrecio,
  validarStock,
  validarFecha,
  validarCategoria,
  validarImagenURL,
  validarMarca,
  validarModelo,
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
    console.log("Entra Aqui check")
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
  console.log("ENTRA: ", data)
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

  if (!validarMarca(data.proveedor)) {
    validationErrors.proveedor = "Marca inválida";
  }

  /* if (!validarModelo(data.model)) {
    validationErrors.model = "Modelo inválido";
  } */

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
