import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/pages/login';
import Chat from './components/pages/chat';
import Register from './components/pages/register';
import './App.css';
import {Container} from 'react-bootstrap'
import NavBar from './components/NavBar';
import { AuthContext } from './context/AuthContext';
import React, { useContext } from 'react';
import { ChatContextProvider } from './context/ChatContext';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
    <ChatContextProvider user={user}>
      <NavBar/>
      <Container>
        <Routes>
          <Route path="/login" element={user ? <Chat /> : <Login />} /> {/* Add a Home route (optional) */}
          <Route path="/" element={user ? <Chat /> : <Login/>} />
          <Route path="/register" element={user ? <Chat /> : <Register/>} />
        </Routes>
        </Container>
        </ChatContextProvider>
      </BrowserRouter>
  );
}

export default App;
