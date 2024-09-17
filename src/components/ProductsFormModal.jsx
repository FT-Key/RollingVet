import { useState } from "react";
import { Container } from "react-bootstrap";
import { formatDate } from "../helpers/FormatDateHTML";
import ProductImage from "./ProductImage";

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
        <ProductImage source={editedData.imagenUrl || ''} />
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
              value={editedData.imagenUrl || ""}
              onChange={handleChange}
              placeholder="URL de la imagen"
            />
          </div>
        )}

        {imageOption === "Subir archivo" && (
          <div>
            <label>Subir archivo</label>
            <input type="file" name="imagenUrl" onChange={handleChange} />
          </div>
        )}

        {imageOption === "Seleccionar existente" && (
          <div>
            <label>Seleccionar imagen existente</label>
            <select name="imagenUrl" value={editedData.imagenUrl} onChange={handleChange}>
              {editedData.imagenesUrls && editedData.imagenesUrls.map((url, index) => {
                const shortenedUrl = url.length > 35 ? `${url.substring(0, 35)}...` : url;
                return (
                  <option key={index} value={url}>
                    {shortenedUrl}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={editedData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre del producto"
        />
      </div>
      <div>
        <label>Precio</label>
        <input
          type="number"
          name="precio"
          value={editedData.precio || ""}
          onChange={handleChange}
          placeholder="Precio"
        />
      </div>
      <div>
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={editedData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción del producto"
        />
      </div>
      <div>
        <label>Categoría</label>
        <input
          type="text"
          name="categoria"
          value={editedData.categoria || ""}
          onChange={handleChange}
          placeholder="Categoría"
        />
      </div>
      <div>
        <label>Stock</label>
        <input
          type="number"
          name="cantidadEnStock"
          value={editedData.cantidadEnStock || ""}
          onChange={handleChange}
          placeholder="Stock"
        />
      </div>
      <div>
        <label>Marca</label>
        <input
          type="text"
          name="proveedor"
          value={editedData.proveedor || ""}
          onChange={handleChange}
          placeholder="Marca"
        />
      </div>
      <div>
        <label>Código de barras</label>
        <input
          type="text"
          name="codigoDeBarras"
          value={editedData.codigoDeBarras || ""}
          onChange={handleChange}
          placeholder="Código de barras"
        />
      </div>

      <div>
        <label>Calificaciones</label>
        <input
          type="number"
          name="calificaciones"
          value={editedData.calificaciones.toString() || ""}
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
          name="garantia"
          value={editedData.garantia || ""}
          onChange={handleChange}
          placeholder="Garantía"
        />
      </div>
      <div>
        <label>Fecha de Ingreso</label>
        <input
          type="date"
          name="fechaDeIngreso"
          value={formatDate(editedData.fechaDeIngreso) || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Descuento</label>
        <input
          type="text"
          name="descuento"
          value={editedData.descuento || ""}
          onChange={handleChange}
          placeholder="Descuento"
        />
      </div>
    </Container>
  );
};

export default ProductsFormModal;