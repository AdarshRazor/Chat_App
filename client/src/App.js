import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/pages/login';
import Chat from './components/pages/chat';
import Register from './components/pages/register';
import './App.css';
import {Container} from 'react-bootstrap'
import NavBar from './components/NavBar';
import { AuthContext } from './context/AuthContext';
import React, { useContext } from 'react';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <NavBar/>
      <Container>
        <Routes>
          <Route path="/login" element={user ? <Chat /> : <Login />} /> {/* Add a Home route (optional) */}
          <Route path="/" element={user ? <Chat /> : <Login/>} />
          <Route path="/register" element={user ? <Chat /> : <Register/>} />
        </Routes>
        </Container>
      </BrowserRouter>
  );
}

export default App;
