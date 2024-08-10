import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function BasicForm({ type }) {

  // Estados
  const [formLogin, setFormLogin] = useState({
    userName: '',
    userPass: '',
    userRemember: false
  });
  const [formRegister, setFormRegister] = useState({
    userName: '',
    userEmail: '',
    userPass: '',
    userPassConf: ''
  });
  //

  // useEffect para observar cambios en el tipo y limpiar los formularios
  useEffect(() => {
    setFormLogin({
      userName: '',
      userPass: '',
      userRemember: false
    });
    setFormRegister({
      userName: '',
      userEmail: '',
      userPass: '',
      userPassConf: ''
    });
  }, [type]);

  // Funciones
  ////CHANGE

  const handleChangeRegister = (ev) => {
    if (type !== "registro") {
      return console.log("Error al cargar página de registro.");
    }

    setFormRegister({ ...formRegister, [ev.target.name]: ev.target.value });
  }

  const handleChangeLogin = (ev) => {
    if (type !== "inicioSesion") {
      return console.log("Error al cargar página de inicio de sesión.");
    }

    const { name, value, type: inputType, checked } = ev.target;
    setFormLogin({ ...formLogin, [name]: inputType === 'checkbox' ? checked : value });
  }

  ////CLICK
  const handleClickRegister = (ev) => {
    if (type !== "registro") {
      return console.log("Error al cargar página de registro.");
    }

    ev.preventDefault();
    console.log(formRegister);
  }

  const handleClickLogin = (ev) => {
    if (type !== "inicioSesion") {
      return console.log("Error al cargar página de inicio de sesión.");
    }

    ev.preventDefault();
    console.log(formLogin);
  }


  // Constantes
  const TEXT_TYPE = {
    registro: "Registrarse",
    inicioSesion: "Iniciar Sesión"
  };

  const COLOR_TYPE = {
    registro: "success",
    inicioSesion: "primary"
  };

  const CHANGE_TYPE = {
    registro: handleChangeRegister,
    inicioSesion: handleChangeLogin,
  };

  const CLICK_TYPE = {
    registro: handleClickRegister,
    inicioSesion: handleClickLogin,
  };
  //

  return (
    <>
      <h2 className='pt-4 text-center'>{TEXT_TYPE[type]}</h2>

      <Form className='w-100 h-100 d-flex flex-column justify-content-center align-items-center pt-3 pb-2'>

        <Form.Group controlId="formUserName">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            name='userName'
            type="text"
            placeholder="Nombre de usuario"
            value={type === 'registro' ? formRegister.userName : formLogin.userName}
            onChange={CHANGE_TYPE[type]}
            autoComplete="username"
          />
        </Form.Group>

        {type === "registro" &&
          <Form.Group controlId="formUserEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name='userEmail'
              type="email"
              placeholder="Email"
              value={formRegister.userEmail}
              onChange={CHANGE_TYPE[type]}
            />
          </Form.Group>
        }

        <Form.Group controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            name='userPass'
            type="password"
            placeholder="Contraseña"
            value={type === 'registro' ? formRegister.userPass : formLogin.userPass}
            onChange={CHANGE_TYPE[type]}
          />
        </Form.Group>

        {type === "registro" &&
          <Form.Group controlId="formPasswordRepeat">
            <Form.Label>Repetir Contraseña</Form.Label>
            <Form.Control
              name='userPassConf'
              type="password"
              placeholder="Repetir contraseña"
              value={formRegister.userPassConf}
              onChange={CHANGE_TYPE[type]}
            />
          </Form.Group>
        }

        {type === "inicioSesion" &&
          <>
            <Form.Group controlId="formRemember" className='pt-2'>
              <Form.Check
                name='userRemember'
                type="checkbox"
                label="Mantener sesión iniciada"
                checked={formLogin.userRemember}
                onChange={CHANGE_TYPE[type]}
              />
            </Form.Group>

            <Container className='d-flex justify-content-center align-items-center pt-2'>
              <Link to={'/recuperarContraseña'}>¿Olvidaste tu contraseña?</Link>
            </Container>
          </>
        }

        <Button variant={COLOR_TYPE[type]} type="submit" className='mt-3' onClick={CLICK_TYPE[type]}>
          {TEXT_TYPE[type]}
        </Button>
      </Form>
    </>
  );
}

export default BasicForm;
