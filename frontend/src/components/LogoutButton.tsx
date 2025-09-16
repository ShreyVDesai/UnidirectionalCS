// src/components/LogoutButton.tsx
import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
      Logout
    </Button>
  );
};

export default LogoutButton;
