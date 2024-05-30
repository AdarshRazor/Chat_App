import React, { useContext, useState } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import '../styles/register.css';
import { AuthContext } from '../../context/AuthContext';

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, registerSuccess } = useContext(AuthContext);

  return (
    <>
      <Form className='my-4' onSubmit={registerUser}>
        <h1>Register</h1>

        <Form.Group className="mb-3" controlId="formBasicUser">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={registerInfo.name}
            placeholder="Enter username"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, name: e.target.value })
            }
          />
          <Form.Text className="text-muted">
            Make it unique 🙄
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={registerInfo.email}
            placeholder="Enter email"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, email: e.target.value })
            }
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={registerInfo.password}
              onChange={(e) =>
                updateRegisterInfo({ ...registerInfo, password: e.target.value })
              }
            />
            <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicInviteCode">
          <Form.Label>Invite Code</Form.Label>
          <Form.Control
            type="text"
            value={registerInfo.inviteCode}
            placeholder="Enter invite code"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, inviteCode: e.target.value })
            }
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isRegisterLoading}>
          {isRegisterLoading ? "Loading..." : "Register"}
        </Button>

        {registerError && (
          <Alert variant='danger' className='m-3'>
            {registerError}
          </Alert>
        )}

        {registerSuccess && (
          <Alert variant='success' className='m-3'>
            {registerSuccess}
          </Alert>
        )}
      </Form>
    </>
  );
}

export default Register;
