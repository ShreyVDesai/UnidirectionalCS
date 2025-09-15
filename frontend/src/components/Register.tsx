import React, { useState } from 'react';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../types';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<UserType>('A');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post('/auth/register', { username, email, password, type });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={2}>Register</Typography>
      <TextField fullWidth label="Username" margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
      <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth type="password" label="Password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
      <TextField select fullWidth label="Type" margin="normal" value={type} onChange={e => setType(e.target.value as UserType)}>
        <MenuItem value="A">Type A (Requester)</MenuItem>
        <MenuItem value="B">Type B (Responder)</MenuItem>
      </TextField>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Register</Button>
      <Button color="secondary" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/login')}>Go to Login</Button>
    </Container>
  );
};

export default Register;
