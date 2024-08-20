import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { postServerData } from '../helpers/ServerCalling';

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
  const [clearForm, setClearForm] = useState(false);
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

    // Seteo el clearForm para limpiar los formularios al desmontar el componente
    return () => {
      setClearForm(true);
    };
  }, [clearForm]);

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
  const handleClickRegister = async (ev) => {
    ev.preventDefault();

    if (type !== "registro") {
      return console.log("Error al cargar página de registro.");
    }

    console.log(formRegister);

    if (formRegister.userPass !== formRegister.userPassConf) {
      return console.log("Las contraseñas no coinciden");
    }

    const apiUrl = import.meta.env.VITE_API_URL;

    const serverResponse = await postServerData(apiUrl, '/reg', formRegister);

    if (serverResponse.ok) {
      const serverData = await serverResponse.json(); // Lee los datos del servidor
      const { token: jwtToken } = serverData; // Desestructura el token del JSON

      // Almacenar el token JWT en localStorage
      localStorage.setItem('authToken', jwtToken);

      // Opcionalmente, decodificar el token para mostrar datos del usuario
      const decodedToken = jwtDecode(jwtToken);

      console.log("Registro exitoso")
      console.log(decodedToken)

    } else if (!serverResponse.ok) {
      throw new Error('Error en el servidor al registrarse');
    }
  }

  const handleClickLogin = async (ev) => {
    ev.preventDefault();

    if (type !== "inicioSesion") {
      return console.log("Error al cargar página de inicio de sesión.");
    }

    console.log(formLogin);

    const apiUrl = import.meta.env.VITE_API_URL;

    const serverResponse = await postServerData(apiUrl, '/auth', formLogin);

    if (serverResponse.ok) {
      const serverData = await serverResponse.json(); // Lee los datos del servidor
      const { token: jwtToken } = serverData; // Desestructura el token del JSON

      // Almacenar el token JWT en localStorage
      localStorage.setItem('authToken', jwtToken);

      // Opcionalmente, decodificar el token para mostrar datos del usuario
      const decodedToken = jwtDecode(jwtToken);

      console.log("Sesión iniciada con éxito")
      console.log(decodedToken)

    } else if (!serverResponse.ok) {
      throw new Error('Error en el servidor al iniciar sesión');
    }
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
