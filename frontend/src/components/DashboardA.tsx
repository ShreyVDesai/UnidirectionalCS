import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import api from '../api';
import Messaging from './Messaging';
import { Request } from '../types';

const DashboardA: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selected, setSelected] = useState<Request | null>(null);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/sent');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests');
    }
  };

  const createRequest = async () => {
    try {
      await api.post('/requests');
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError('Failed to create request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (selected) return <Messaging request={selected} onBack={() => setSelected(null)} />;

  return (
    <Container>
      <Typography variant="h4" mt={2}>Type A Dashboard</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={createRequest}>Create Request</Button>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {requests.map(req => (
          <ListItemButton
            key={req._id}
            onClick={() => setSelected(req)}
          >
            <ListItemText
              primary={`Request to ${req.acceptedBy ? (typeof req.acceptedBy === 'string' ? req.acceptedBy : req.acceptedBy.username) : 'Pending...'}`}
              secondary={`Accepted: ${req.acceptedAt ? new Date(req.acceptedAt).toLocaleString() : 'No'}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
};

export default DashboardA;
