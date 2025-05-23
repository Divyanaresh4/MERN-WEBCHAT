import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Chat from './components/Chat/Chat';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/chat/123" : "/login"} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat/:id" element={token ? <Chat /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/chat/123" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
