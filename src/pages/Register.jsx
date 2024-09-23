import { useNavigate } from 'react-router-dom';
import BasicForm from '../components/BasicForm'
import GoogleAuth from '../components/GoogleAuth';
import { Container } from 'react-bootstrap'
import { useEffect } from 'react';
import { getToken } from '../helpers/Token.helper';
import { Helmet } from "react-helmet";

const Register = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);
  return (
    <>
      <Helmet>
        <title>Registrarse</title>
      </Helmet>
      {token ?
        <h2 className='text-center m-5'>Ya se inició sesión</h2>
        :
        <>
          <BasicForm type={"registro"} />

          <p className='text-center'>o</p>

          <Container className='d-flex flex-column justify-content-center align-items-center pb-3 gap-2'>
            <GoogleAuth useParameter={'register'} />
          </Container>
        </>
      }
    </>
  )
}

export default Register