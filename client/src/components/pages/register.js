import React, { useContext, useState, useCallback } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import '../styles/register.css';
import { AuthContext } from '../../context/AuthContext';
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

  const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, registerSuccess } = useContext(AuthContext);

  return (
    <>
    <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    opacity: 0,
                },
                fpsLimit: 520,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 150,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#FFFFFF"],

                    },
                    links: {
                        color: ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
                        "#FFFF00", "#00FFFF", "#FF00FF", "#C0C0C0", "#808080", 
                        "#800000", "#808000", "#008000", "#800080", "#008080", 
                        "#000080", "#FFA500", "#FFC0CB", "#FFD700", "#A52A2A"
                        ],
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 2000,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 },
                    },
                },
                detectRetina: true,
            }}
        />
      <Form onSubmit={registerUser}>
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
