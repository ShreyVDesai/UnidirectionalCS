// src/pages/Messaging.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import api from "../api";
import { Request, Message } from "../types";

interface MessagingProps {
  request: Request;
  onBack: () => void;
}

const Messaging: React.FC<MessagingProps> = ({ request, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      console.log("[MESSAGING] Fetching messages for request:", request._id);
      const res = await api.get(`/messages/${request._id}`);
      console.log("[MESSAGING] Messages received:", res.data);
      setMessages(res.data);
    } catch (err: any) {
      console.error("[MESSAGING] Error fetching messages:", err);
      console.error("[MESSAGING] Error response:", err.response?.data);
    }
  };

  const sendMessage = async () => {
    if (!text) return;
    try {
      console.log("[MESSAGING] Sending message:", {
        requestId: request._id,
        content: text,
      });
      const response = await api.post("/messages", {
        requestId: request._id,
        content: text,
      });
      console.log("[MESSAGING] Message sent successfully:", response.data);
      setText("");
      fetchMessages();
    } catch (err: any) {
      console.error("[MESSAGING] Error sending message:", err);
      console.error("[MESSAGING] Error response:", err.response?.data);
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
              primary={`${
                typeof msg.from === "string" ? msg.from : msg.from.username
              }: ${msg.content}`}
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
