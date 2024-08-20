import BasicForm from '../components/BasicForm'
import GoogleAuth from '../components/GoogleAuth';
import { Container } from 'react-bootstrap'

const Register = () => {
  return (
    <>
      <BasicForm type={"registro"} />

      <p className='text-center'>o</p>

      <Container className='d-flex flex-column justify-content-center align-items-center pb-3 gap-2'>
        <GoogleAuth type={"default"} useParameter={'register'} />
      </Container>
    </>
  )
}

export default Register