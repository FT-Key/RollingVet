import { Helmet } from 'react-helmet-async';
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [validado, setValidado] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await axios.post("/api/contacto", formData);
        if (response.status === 200) {
          setExito("¡Tu mensaje ha sido enviado exitosamente!");
          setFormData({
            nombre: "",
            email: "",
            telefono: "",
            asunto: "",
            mensaje: "",
          });
        }
      } catch (error) {
        setError("Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.");
      }
    }
    setValidado(true);
  };

  return (
    <>
      <Helmet>
        <title>Contacto</title>
      </Helmet>
      <div className="contact-form py-3">
        <h2 className='text-center'>Contáctanos</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {exito && <Alert variant="success">{exito}</Alert>}

        <div className='d-flex justify-content-center'>
          <Form className='w-25 d-flex flex-column justify-content-center gap-3' noValidate validated={validado} onSubmit={manejarEnvio} style={{ minWidth: '300px' }}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ingresa tu nombre"
                name="nombre"
                value={formData.nombre}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, ingresa tu nombre.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Ingresa tu email"
                name="email"
                value={formData.email}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, ingresa un email válido.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono (opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu número de teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={manejarCambio}
              />
            </Form.Group>

            <Form.Group controlId="formAsunto">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ingresa el asunto"
                name="asunto"
                value={formData.asunto}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, ingresa un asunto.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formMensaje">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={5}
                placeholder="Ingresa tu mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, ingresa un mensaje.
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Enviar Mensaje
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Contacto;