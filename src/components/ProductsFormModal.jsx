import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { formatDate } from "../helpers/FormatDateHTML";
import ProductImage from "./ProductImage";

const ProductsFormModal = ({ handleChange, editedData, errores }) => {
  const [imageOption, setImageOption] = useState("Agregar URL");

  const handleImageOptionChange = (e) => {
    setImageOption(e.target.value);
  };

  return (
    <Container fluid className="container-adminProducts">
      <Form className="w-100 mb-4 d-flex flex-column gap-3">
        <h3 className='text-center'>Editar Producto</h3>

        <div>
          <p className="m-0">ID: {editedData.id}</p>
        </div>
        <div>
          <ProductImage source={editedData.imagenUrl || ''} />
        </div>
        <Form.Group controlId="formImageOption">
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            as="select"
            value={imageOption}
            onChange={handleImageOptionChange}
          >
            <option value="Agregar URL">Agregar URL</option>
            <option value="Subir archivo">Subir archivo</option>
            <option value="Seleccionar existente">Seleccionar imagen ya existente</option>
          </Form.Control>

          {imageOption === "Agregar URL" && (
            <Form.Group controlId="formImageUrl">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="text"
                name="imagenUrl"
                value={editedData.imagenUrl || ""}
                onChange={handleChange}
                isInvalid={!!errores.imagenUrl}
                placeholder="URL de la imagen"
              />
              <Form.Control.Feedback type="invalid">
                {errores.imagenUrl}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {imageOption === "Subir archivo" && (
            <Form.Group controlId="formUploadImage">
              <Form.Label>Subir archivo</Form.Label>
              <Form.Control
                type="file"
                name="imagenUrl"
                onChange={handleChange}
                isInvalid={!!errores.imagenUrl}
              />
              <Form.Control.Feedback type="invalid">
                {errores.imagenUrl}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {imageOption === "Seleccionar existente" && (
            <Form.Group controlId="formSelectImage">
              <Form.Label>Seleccionar imagen existente</Form.Label>
              <Form.Control
                as="select"
                name="imagenUrl"
                value={editedData.imagenUrl || ""}
                onChange={handleChange}
                isInvalid={!!errores.imagenUrl}
              >
                {editedData.imagenesUrls &&
                  editedData.imagenesUrls.map((url, index) => {
                    const shortenedUrl =
                      url.length > 35 ? `${url.substring(0, 35)}...` : url;
                    return (
                      <option key={index} value={url}>
                        {shortenedUrl}
                      </option>
                    );
                  })}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errores.imagenUrl}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </Form.Group>

        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={editedData.nombre || ""}
            onChange={handleChange}
            isInvalid={!!errores.nombre}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errores.nombre}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPrecio">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            value={editedData.precio || ""}
            onChange={handleChange}
            isInvalid={!!errores.precio}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errores.precio}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDescripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="descripcion"
            value={editedData.descripcion || ""}
            onChange={handleChange}
            placeholder="Descripción del producto"
          />
        </Form.Group>

        <Form.Group controlId="formCategoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            type="text"
            name="categoria"
            value={editedData.categoria || ""}
            onChange={handleChange}
            isInvalid={!!errores.categoria}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errores.categoria}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formStock">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            name="cantidadEnStock"
            value={editedData.cantidadEnStock || ""}
            onChange={handleChange}
            isInvalid={!!errores.cantidadEnStock}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errores.cantidadEnStock}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formProveedor">
          <Form.Label>Marca</Form.Label>
          <Form.Control
            type="text"
            name="proveedor"
            value={editedData.proveedor || ""}
            onChange={handleChange}
            isInvalid={!!errores.proveedor}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errores.proveedor}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formCodigoBarras">
          <Form.Label>Código de barras</Form.Label>
          <Form.Control
            type="text"
            name="codigoDeBarras"
            value={editedData.codigoDeBarras || ""}
            onChange={handleChange}
            isInvalid={!!errores.codigoDeBarras}
          />
          <Form.Control.Feedback type="invalid">
            {errores.codigoDeBarras}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formCalificaciones">
          <Form.Label>Calificaciones</Form.Label>
          <Form.Control
            type="number"
            name="calificaciones"
            value={editedData.calificaciones?.toString() || ""}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="5"
            isInvalid={!!errores.calificaciones}
            placeholder="Calificación (0-5)"
          />
          <Form.Control.Feedback type="invalid">
            {errores.calificaciones}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formGarantia">
          <Form.Label>Garantía</Form.Label>
          <Form.Control
            type="text"
            name="garantia"
            value={editedData.garantia || ""}
            onChange={handleChange}
            isInvalid={!!errores.garantia}
          />
          <Form.Control.Feedback type="invalid">
            {errores.garantia}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFechaIngreso">
          <Form.Label>Fecha de Ingreso</Form.Label>
          <Form.Control
            type="date"
            name="fechaDeIngreso"
            value={formatDate(editedData.fechaDeIngreso) || ""}
            onChange={handleChange}
            onClick={(e) => e.target.showPicker()}
            isInvalid={!!errores.fechaDeIngreso}
          />
          <Form.Control.Feedback type="invalid">
            {errores.fechaDeIngreso}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDescuento">
          <Form.Label>Descuento</Form.Label>
          <Form.Control
            type="text"
            name="descuento"
            value={editedData.descuento || ""}
            onChange={handleChange}
            isInvalid={!!errores.descuento}
          />
          <Form.Control.Feedback type="invalid">
            {errores.descuento}
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default ProductsFormModal;