import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardA from './components/DashboardA';
import DashboardB from './components/DashboardB';

const App: React.FC = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('type');

  if (!token) return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>;

  return <Routes>
    {userType === 'A' && <Route path="/" element={<DashboardA />} />}
    {userType === 'B' && <Route path="/" element={<DashboardB />} />}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
};

export default App;
