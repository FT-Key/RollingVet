import { Container } from "react-bootstrap";
import {
  ESTADOS_SUSCRIPCION,
  IDIOMAS,
  PAISES,
  PREGUNTAS_SEGURIDAD,
  REGIONES,
  ROLES,
  TEMAS,
} from "../utils/usersConst.utils";

const UserFormModal = ({ handleChange, editedData }) => {
  return (
    <Container fluid className="container-adminUsers">
      <div>
        <p className="m-0">ID: {editedData.id || "ID"}</p>
      </div>
      <div>
        <label>Nombre de Usuario</label>
        <input
          type="text"
          name="nombreUsuario"
          value={editedData.nombreUsuario || ""}
          onChange={handleChange}
          placeholder="Nombre de Usuario"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={editedData.email || ""}
          onChange={handleChange}
          placeholder="Email"
        />
      </div>
      <div>
        <label>Contraseña</label>
        <input
          type="password"
          name="contrasenia"
          value={editedData.contrasenia || ""}
          placeholder={
            editedData.contrasenia
              ? editedData.contrasenia.replace(/./g, "*")
              : "Contraseña"
          }
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={editedData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre"
        />
      </div>
      <div>
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={editedData.apellido || ""}
          onChange={handleChange}
          placeholder="Apellido"
        />
      </div>
      <div>
        <label>Dirección</label>
        <input
          type="text"
          name="direccion.calle"
          value={editedData.direccion.calle || ""}
          onChange={handleChange}
          placeholder="Calle"
        />
        <input
          type="text"
          name="direccion.ciudad"
          value={editedData.direccion.ciudad || ""}
          onChange={handleChange}
          placeholder="Ciudad"
        />
        <input
          type="text"
          name="direccion.estado"
          value={editedData.direccion.estado || ""}
          onChange={handleChange}
          placeholder="Estado"
        />
        <input
          type="text"
          name="direccion.codigoPostal"
          value={editedData.direccion.codigoPostal || ""}
          onChange={handleChange}
          placeholder="Código Postal"
        />
        <label>País</label>
        <select
          name="direccion.pais"
          value={editedData.direccion.pais || ""}
          onChange={handleChange}
        >
          {PAISES.map((pais) => (
            <option key={pais} value={pais}>
              {pais}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={editedData.telefono || ""}
          onChange={handleChange}
          placeholder="Teléfono"
        />
      </div>
      <div>
        <label>Preferencias</label>
        <label>Idioma</label>
        <select
          name="preferencias.idioma"
          onChange={handleChange}
          value={editedData.preferencias.idioma || ""}
        >
          {IDIOMAS.map((idioma) => (
            <option key={idioma} value={idioma}>
              {idioma}
            </option>
          ))}
        </select>
        <label>Tema</label>
        <select
          name="preferencias.tema"
          onChange={handleChange}
          value={editedData.preferencias.tema || ""}
        >
          {TEMAS.map((tema) => (
            <option key={tema} value={tema}>
              {tema}
            </option>
          ))}
        </select>
      </div>
      <div>
        {editedData.preguntasSeguridad.map((preguntaSeguridad, index) => (
          <div key={index}>
            <label>Pregunta de Seguridad {index + 1}</label>
            <select
              name={`preguntasSeguridad[${index}].pregunta`}
              onChange={handleChange}
              value={preguntaSeguridad.pregunta || ""}
            >
              {PREGUNTAS_SEGURIDAD.map((pregunta) => (
                <option key={pregunta} value={pregunta}>
                  {pregunta}
                </option>
              ))}
            </select>
            <input
              type="text"
              name={`preguntasSeguridad[${index}].respuesta`}
              value={preguntaSeguridad.respuesta || ""}
              onChange={handleChange}
              placeholder="Respuesta"
            />
          </div>
        ))}
      </div>
      <div>
        <label>Biografía</label>
        <textarea
          name="biografia"
          value={editedData.biografia || ""}
          onChange={handleChange}
          placeholder="Biografía"
        />
      </div>
      <div>
        <label>Enlaces a Redes Sociales</label>
        <input
          type="text"
          name="enlacesRedesSociales.twitter"
          value={editedData.enlacesRedesSociales.twitter || ""}
          onChange={handleChange}
          placeholder="Twitter"
        />
        <input
          type="text"
          name="enlacesRedesSociales.linkedin"
          value={editedData.enlacesRedesSociales.linkedin || ""}
          onChange={handleChange}
          placeholder="LinkedIn"
        />
      </div>
      <div>
        <label>Estado de Suscripción</label>
        <select
          name="estadoSuscripcion"
          value={editedData.estadoSuscripcion || ""}
          onChange={handleChange}
        >
          {ESTADOS_SUSCRIPCION.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Notificaciones</label>
        <label>Email</label>
        <input
          type="checkbox"
          name="notificaciones.email"
          checked={editedData.notificaciones.email || false}
          onChange={() =>
            setEditedData((prevData) => ({
              ...prevData,
              notificaciones: {
                ...prevData.notificaciones,
                email: !prevData.notificaciones.email,
              },
            }))
          }
        />
        <label>SMS</label>
        <input
          type="checkbox"
          name="notificaciones.sms"
          checked={editedData.notificaciones.sms || false}
          onChange={() =>
            setEditedData((prevData) => ({
              ...prevData,
              notificaciones: {
                ...prevData.notificaciones,
                sms: !prevData.notificaciones.sms,
              },
            }))
          }
        />
      </div>
      <div className="flex-row justify-content-start">
        <label>Autenticación Dos Factores</label>
        <input
          type="checkbox"
          name="autenticacionDosFactores"
          checked={editedData.autenticacionDosFactores || false}
          onChange={() =>
            setEditedData((prevData) => ({
              ...prevData,
              autenticacionDosFactores: !prevData.autenticacionDosFactores,
            }))
          }
        />
      </div>
      <div>
        <label>Región</label>
        <select
          name="region"
          onChange={handleChange}
          value={editedData.region || ""}
        >
          {REGIONES.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Rol</label>
        <select name="rol" onChange={handleChange} value={editedData.rol || ""}>
          {ROLES.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </select>
      </div>
    </Container>
  );
};

export default UserFormModal;
