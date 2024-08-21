import { useState } from "react";
import { Container } from "react-bootstrap";
import { formatDate } from "../helpers/FormatDateHTML";

const ProductsFormModal = ({ handleChange, editedData }) => {
  const [imageOption, setImageOption] = useState("Agregar URL");

  const handleImageOptionChange = (e) => {
    setImageOption(e.target.value);
  };

  return (
    <Container fluid className="container-adminProducts">
      <div>
        <p className="m-0">ID: {editedData.id}</p>
      </div>
      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={editedData.name || ""}
          onChange={handleChange}
          placeholder="Nombre del producto"
        />
      </div>
      <div>
        <label>Precio</label>
        <input
          type="number"
          name="price"
          value={editedData.price || ""}
          onChange={handleChange}
          placeholder="Precio"
        />
      </div>
      <div>
        <label>Descripción</label>
        <textarea
          name="description"
          value={editedData.description || ""}
          onChange={handleChange}
          placeholder="Descripción del producto"
        />
      </div>
      <div>
        <label>Categoría</label>
        <input
          type="text"
          name="category"
          value={editedData.category || ""}
          onChange={handleChange}
          placeholder="Categoría"
        />
      </div>
      <div>
        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={editedData.stock || ""}
          onChange={handleChange}
          placeholder="Stock"
        />
      </div>
      <div>
        <label>Marca</label>
        <input
          type="text"
          name="brand"
          value={editedData.brand || ""}
          onChange={handleChange}
          placeholder="Marca"
        />
      </div>
      <div>
        <label>Modelo</label>
        <input
          type="text"
          name="model"
          value={editedData.model || ""}
          onChange={handleChange}
          placeholder="Modelo"
        />
      </div>

      {/* Opción para la imagen */}
      <div>
        <label>Imagen</label>
        <select value={imageOption} onChange={handleImageOptionChange}>
          <option value="Agregar URL">Agregar URL</option>
          <option value="Subir archivo">Subir archivo</option>
          <option value="Seleccionar existente">Seleccionar imagen ya existente</option>
        </select>

        {/* Mostrar input según la opción seleccionada */}
        {imageOption === "Agregar URL" && (
          <div>
            <label>URL de la imagen</label>
            <input
              type="text"
              name="imageUrl"
              value={editedData.imageUrl || ""}
              onChange={handleChange}
              placeholder="URL de la imagen"
            />
          </div>
        )}

        {imageOption === "Subir archivo" && (
          <div>
            <label>Subir archivo</label>
            <input type="file" name="imageFile" onChange={handleChange} />
          </div>
        )}

        {imageOption === "Seleccionar existente" && (
          <div>
            <label>Seleccionar imagen existente</label>
            <select name="imageUrl" onChange={handleChange}>
              {editedData.imageUrls && editedData.imageUrls.map((url, index) => (
                <option key={index} value={url}>
                  {url}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label>Calificaciones</label>
        <input
          type="number"
          name="ratings"
          value={editedData.ratings || ""}
          onChange={handleChange}
          step="0.1"
          min="0"
          max="5"
          placeholder="Calificación (0-5)"
        />
      </div>
      <div>
        <label>Garantía</label>
        <input
          type="text"
          name="warranty"
          value={editedData.warranty || ""}
          onChange={handleChange}
          placeholder="Garantía"
        />
      </div>
      <div>
        <label>Fecha de Lanzamiento</label>
        <input
          type="date"
          name="releaseDate"
          value={formatDate(editedData.releaseDate) || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Descuento</label>
        <input
          type="text"
          name="discount"
          value={editedData.discount || ""}
          onChange={handleChange}
          placeholder="Descuento"
        />
      </div>
    </Container>
  );
};

export default ProductsFormModal;