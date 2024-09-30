import { Helmet } from 'react-helmet-async';
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { validateContactFields } from '../components/Validators';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState("");

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validar los campos antes de enviar el formulario
    const erroresValidados = validateContactFields(formData);

    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados); // Mostrar errores específicos
      return;
    }

    // Si no hay errores, proceder con el envío del formulario
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/contacto`, formData);

      if (response.status === 200) {
        setExito("Tu mensaje fue enviado con éxito, pronto nos contactaremos contigo.");
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
        });
        setErrores({});
        setTimeout(() => {
          setExito("");
        }, 5000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setErrores({ general: "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde." });
    }
  };

  return (
    <>
      <Helmet>
        <title>Contacto</title>
      </Helmet>
      <div className="contact-form py-3">
        <h2 className='text-center'>Contáctanos</h2>

        {errores.general && <Alert variant="danger">{errores.general}</Alert>}
        {exito && <Alert variant="success">{exito}</Alert>}

        <div className='d-flex justify-content-center'>
          <Form className='w-25 d-flex flex-column justify-content-center gap-3' noValidate onSubmit={manejarEnvio} style={{ minWidth: '300px' }}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                name="nombre"
                value={formData.nombre}
                onChange={manejarCambio}
                isInvalid={!!errores.nombre} // Añadir validación visual
              />
              <Form.Control.Feedback type="invalid">
                {errores.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                name="email"
                value={formData.email}
                onChange={manejarCambio}
                isInvalid={!!errores.email} // Añadir validación visual
              />
              <Form.Control.Feedback type="invalid">
                {errores.email}
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
                type="text"
                placeholder="Ingresa el asunto"
                name="asunto"
                value={formData.asunto}
                onChange={manejarCambio}
                isInvalid={!!errores.asunto} // Añadir validación visual
              />
              <Form.Control.Feedback type="invalid">
                {errores.asunto}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formMensaje">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Ingresa tu mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={manejarCambio}
                isInvalid={!!errores.mensaje} // Añadir validación visual
              />
              <Form.Control.Feedback type="invalid">
                {errores.mensaje}
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