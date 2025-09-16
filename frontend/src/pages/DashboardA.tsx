import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import api from '../api';
import { Request } from '../types';
import Messaging from './Messaging';
import LogoutButton from '../components/LogoutButton';

const DashboardA: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createRequest = async () => {
    try {
      await api.post('/requests');
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (selectedRequest) {
    return <Messaging request={selectedRequest} onBack={() => setSelectedRequest(null)} />;
  }

  return (
    <Container>
      <Typography variant="h4" mt={2}>
        Dashboard A (Requester)
      </Typography>
      <Button variant="contained" color="primary" onClick={createRequest} sx={{ mt: 2 }}>
        Create Request
      </Button>
      <List sx={{ mt: 2 }}>
        {requests.map((req) => (
          <ListItem key={req._id} disablePadding>
            <ListItemButton onClick={() => setSelectedRequest(req)}>
              <ListItemText
                primary={`Request from ${
                  typeof req.from === 'string' ? req.from : req.from.email
                }`}
                secondary={req.responded ? 'Responded' : 'Pending'}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <LogoutButton />
    </Container>
  );
};

export default DashboardA;
