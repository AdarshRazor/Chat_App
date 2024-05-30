import React, {useContext} from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import '../styles/login.css'
import { AuthContext } from '../../context/AuthContext'

function Login() {

  const { loginUser, loginError, loginInfo, updateLoginInfo, isloginLoading} = useContext(AuthContext);

  return (
    <>
          <Form className='my-4' onSubmit={loginUser}>

          <h1>Login</h1>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e)=> updateLoginInfo({...loginInfo, email: e.target.value})} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e)=> updateLoginInfo({...loginInfo, password: e.target.value})}/>
              <Form.Text className="text-muted">
                Shhh... 🤫 Make sure no one is watching 
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              {isloginLoading? "Please wait..." : "Login" }
            </Button>

            {loginError && (<Alert variant='danger' className='m-3'>
                {loginError}
              </Alert> )}
              
          </Form>
    </>
  )
}

export default Login