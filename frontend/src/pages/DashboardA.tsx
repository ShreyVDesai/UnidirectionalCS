import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import api from "../api";
import { Request } from "../types";
import Messaging from "./Messaging";
import LogoutButton from "../components/LogoutButton";

const DashboardA: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchRequests = async () => {
    try {
      console.log("[DASHBOARD A] Fetching sent requests");
      const res = await api.get("/requests/sent");
      console.log("[DASHBOARD A] Sent requests received:", res.data);
      setRequests(res.data);
    } catch (err: any) {
      console.error("[DASHBOARD A] Error fetching requests:", err);
      console.error("[DASHBOARD A] Error response:", err.response?.data);
    }
  };

  const testBackend = async () => {
    try {
      console.log("[DASHBOARD A] Testing backend connection");
      const response = await api.get("/test");
      console.log("[DASHBOARD A] Backend test successful:", response.data);
      alert("Backend is working!");
    } catch (err: any) {
      console.error("[DASHBOARD A] Backend test failed:", err);
      alert("Backend connection failed!");
    }
  };

  const createRequest = async () => {
    console.log("[DASHBOARD A] Create request button clicked");
    setIsCreating(true);

    try {
      console.log("[DASHBOARD A] Sending POST request to /requests");
      const response = await api.post("/requests");
      console.log("[DASHBOARD A] Request created successfully:", response.data);

      console.log("[DASHBOARD A] Refreshing requests list");
      await fetchRequests();

      alert("Request created successfully!");
    } catch (err: any) {
      console.error("[DASHBOARD A] Error creating request:", err);
      console.error("[DASHBOARD A] Error response:", err.response?.data);
      console.error("[DASHBOARD A] Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.error ||
        "Failed to create request. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (selectedRequest) {
    return (
      <Messaging
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
      />
    );
  }

  return (
    <Container>
      <Typography variant="h4" mt={2}>
        Dashboard A (Requester)
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={testBackend}
        sx={{ mt: 2, mr: 2 }}
      >
        Test Backend
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={createRequest}
        disabled={isCreating}
        sx={{ mt: 2 }}
      >
        {isCreating ? "Creating..." : "Create Request"}
      </Button>
      <List sx={{ mt: 2 }}>
        {requests.map((req) => (
          <ListItem key={req._id} disablePadding>
            <ListItemButton onClick={() => setSelectedRequest(req)}>
              <ListItemText
                primary={`Request to ${
                  typeof req.acceptedBy === "string"
                    ? req.acceptedBy
                    : req.acceptedBy?.username || req.acceptedBy?.email
                }`}
                secondary={
                  req.responded
                    ? "Responded"
                    : "Accepted - Waiting for response"
                }
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
