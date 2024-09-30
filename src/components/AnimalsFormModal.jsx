import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import AnimalImage from "./AnimalImage"; // Componente para mostrar la imagen del animal
import { formatDate } from "../helpers/FormatDateHTML"; // Formatear fechas
import { PLANES, ESTADOS_ANIMAL, ESPECIES, VACUNAS } from "../utils/animalsConst.utils"; // Importar constantes

const AnimalsFormModal = ({ handleChange, editedData }) => {
  const [imageOption, setImageOption] = useState("Agregar URL");

  const handleImageOptionChange = (e) => {
    setImageOption(e.target.value);
  };

  return (
    <Container fluid className="container-adminAnimals">
      <div>
        <label>Nombre</label>
        <input
          className="text-center"
          type="text"
          name="nombre"
          value={editedData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre del animal"
        />
      </div>

      <div>
        <AnimalImage source={editedData.fotoUrl || ""} /> {/* Mostrar imagen del animal */}
      </div>

      <button
        className="btn btn-secondary mb-2"
        onClick={() => setImageOption(imageOption === "Agregar URL" ? "" : "Agregar URL")}
      >
        {imageOption ? "Cancelar" : "Editar foto del animal"}
      </button>

      {imageOption && (
        <div>
          <label>Imagen</label>
          <select value={imageOption} onChange={handleImageOptionChange}>
            <option value="Agregar URL">Agregar URL</option>
            <option value="Subir archivo">Subir archivo</option>
          </select>

          {imageOption === "Agregar URL" && (
            <div>
              <label>URL de la imagen</label>
              <input
                type="text"
                name="fotoUrl"
                value={editedData.fotoUrl || ""}
                onChange={handleChange}
                placeholder="URL de la imagen"
              />
            </div>
          )}

          {imageOption === "Subir archivo" && (
            <div>
              <label>Subir archivo</label>
              <input type="file" name="fotoUrl" onChange={handleChange} />
            </div>
          )}
        </div>
      )}

      <div>
        <label>Tipo</label>
        <select
          name="tipo"
          value={editedData.tipo || ""}
          onChange={handleChange}
        >
          {ESPECIES.map((especie) => (
            <option key={especie} value={especie}>
              {especie}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Raza</label>
        <input
          type="text"
          name="raza"
          value={editedData.raza || ""}
          onChange={handleChange}
          placeholder="Raza"
        />
      </div>

      <div>
        <label>Edad</label>
        <input
          type="number"
          name="edad"
          value={editedData.edad || ""}
          onChange={handleChange}
          placeholder="Edad"
        />
      </div>

      {/* Campo para el género */}
      <div>
        <label>Género</label>
        <select
          name="genero"
          value={editedData.genero || ""}
          onChange={handleChange}
        >
          <option value="">Seleccionar</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
      </div>

      <div>
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={editedData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción"
        />
      </div>

      <div>
        <label>Estado</label>
        <select
          name="estado"
          value={editedData.estado || ""}
          onChange={handleChange}
        >
          {ESTADOS_ANIMAL.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Esterilizado</label>
        <input
          type="checkbox"
          name="esterilizado"
          checked={editedData.esterilizado || false}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Peso (kg)</label>
        <input
          type="number"
          name="peso"
          value={editedData.peso || ""}
          onChange={handleChange}
          placeholder="Peso"
        />
      </div>

      <div>
        <label>Plan</label>
        <select
          name="plan"
          value={editedData.plan || ""}
          onChange={handleChange}
        >
          {PLANES.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Historial Médico</label>
        {/* Listar el historial médico existente */}
        <ul>
          {editedData.historialMedico?.map((evento, index) => (
            <li key={index}>{evento}</li>
          ))}
        </ul>

        {/* Input para agregar un nuevo evento al historial */}
        <input
          type="text"
          name="nuevoEventoHistorial"
          value={editedData.nuevoEventoHistorial || ""}
          onChange={handleChange}
          placeholder="Agregar nuevo evento médico"
        />

        {/* Botón para agregar el nuevo evento al array de historial médico */}
        <button
          type="button"
          onClick={() => {
            if (editedData.nuevoEventoHistorial) {
              handleChange({
                target: {
                  name: "historialMedico",
                  value: [...(editedData.historialMedico || []), editedData.nuevoEventoHistorial],
                },
              });
              handleChange({
                target: { name: "nuevoEventoHistorial", value: "" }, // Limpiar el input después de agregar
              });
            }
          }}
        >
          Agregar
        </button>
      </div>

      <div>
        <label>Vacunas</label>
        <div>
          {VACUNAS.map((vacuna, index) => (
            <div key={index}>
              <label>{vacuna}</label>
              <input
                type="checkbox"
                name={`vacunas[${index}]`}
                checked={editedData.vacunas?.some(v => v.nombre === vacuna) || false}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>Última visita al veterinario</label>
        <input
          type="date"
          name="ultimaVisitaVeterinaria"
          value={formatDate(editedData.ultimaVisitaVeterinaria) || ""}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Fecha de creación</label>
        <input
          type="text"
          value={formatDate(editedData.creadoEn) || ""}
          disabled
        />
      </div>

      <div>
        <label>Fecha de actualización</label>
        <input
          type="text"
          value={formatDate(editedData.actualizadoEn) || ""}
          disabled
        />
      </div>
    </Container>
  );
};

export default AnimalsFormModal;