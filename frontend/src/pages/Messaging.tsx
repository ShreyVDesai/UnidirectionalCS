// src/pages/Messaging.tsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import api from '../api';
import { Request, Message } from '../types';

interface MessagingProps {
  request: Request;
  onBack: () => void;
}

const Messaging: React.FC<MessagingProps> = ({ request, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${request._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text) return;
    try {
      await api.post(`/messages/${request._id}`, { content: text });
      setText('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Button sx={{ mt: 2 }} variant="outlined" onClick={onBack}>
        Back
      </Button>
      <Typography variant="h5" mt={2} mb={2}>
        Conversation
      </Typography>
      <List>
        {messages.map((msg) => (
          <ListItem key={msg._id}>
            <ListItemText
              primary={`${typeof msg.from === 'string' ? msg.from : msg.from.username}: ${msg.content}`}
              secondary={new Date(msg.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={sendMessage} sx={{ mt: 1 }}>
        Send
      </Button>
    </Container>
  );
};

export default Messaging;
