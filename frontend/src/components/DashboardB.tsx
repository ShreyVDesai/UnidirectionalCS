import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import api from '../api';
import Messaging from './Messaging';
import { Request } from '../types';

const DashboardB: React.FC = () => {
  const [pending, setPending] = useState<Request[]>([]);
  const [accepted, setAccepted] = useState<Request[]>([]);
  const [selected, setSelected] = useState<Request | null>(null);

  const fetchPending = async () => {
    try {
      const res = await api.get('/requests/pending');
      setPending(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAccepted = async () => {
    try {
      const res = await api.get('/requests/pending');
      setAccepted(res.data.filter((r: Request) => r.acceptedBy));
    } catch (err) { console.error(err); }
  };

  const acceptRequest = async (id: string) => {
    try {
      await api.post(`/requests/${id}/accept`);
      fetchPending();
      fetchAccepted();
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchPending();
    fetchAccepted();
  }, []);

  if (selected) return <Messaging request={selected} onBack={() => setSelected(null)} />;

  return (
    <Container>
      <Typography variant="h4" mt={2}>Type B Dashboard</Typography>

      <Typography variant="h6" mt={2}>Pending Requests</Typography>
      <List>
        {pending.map(req => (
          <ListItem
            key={req._id}
            secondaryAction={
              <Button variant="contained" onClick={() => acceptRequest(req._id)}>
                Accept
              </Button>
            }
          >
            <ListItemText
              primary={`From ${typeof req.from === 'string' ? req.from : req.from.username}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={2}>Accepted Requests</Typography>
      <List>
        {accepted.map(req => (
          <ListItemButton
            key={req._id}
            onClick={() => setSelected(req)}
          >
            <ListItemText
              primary={`From ${typeof req.from === 'string' ? req.from : req.from.username}`}
              secondary={`Responded: ${req.responded}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
};

export default DashboardB;
