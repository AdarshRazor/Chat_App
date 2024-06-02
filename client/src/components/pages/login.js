import React, {useContext, useCallback} from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import '../styles/login.css'
import { AuthContext } from '../../context/AuthContext'
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`

function Login() {

  const { loginUser, loginError, loginInfo, updateLoginInfo, isloginLoading} = useContext(AuthContext);

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
          <div className='text-center'>
            <p className='text-muted'>— A chat app that <span className='text-warning'>actually</span> doesn't leak your data. —</p>
          </div>
    </>
  )
}

export default Login