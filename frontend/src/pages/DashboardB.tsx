import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import api from "../api";
import { Request } from "../types";
import Messaging from "./Messaging";
import LogoutButton from "../components/LogoutButton";

const DashboardB: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const fetchPendingRequests = async () => {
    try {
      console.log("[DASHBOARD B] Fetching pending requests");
      const res = await api.get("/requests/pending");
      console.log("[DASHBOARD B] Pending requests received:", res.data);
      setPendingRequests(res.data);
    } catch (err: any) {
      console.error("[DASHBOARD B] Error fetching pending requests:", err);
      console.error("[DASHBOARD B] Error response:", err.response?.data);
    }
  };

  const fetchAcceptedRequests = async () => {
    try {
      console.log("[DASHBOARD B] Fetching accepted requests");
      const res = await api.get("/requests/accepted");
      console.log("[DASHBOARD B] Accepted requests received:", res.data);
      setAcceptedRequests(res.data);
    } catch (err: any) {
      console.error("[DASHBOARD B] Error fetching accepted requests:", err);
      console.error("[DASHBOARD B] Error response:", err.response?.data);
    }
  };

  const fetchAllRequests = useCallback(async () => {
    await Promise.all([fetchPendingRequests(), fetchAcceptedRequests()]);
  },[]);

  const acceptRequest = async (id: string) => {
    try {
      console.log("[DASHBOARD B] Accepting request:", id);
      const response = await api.post(`/requests/${id}/accept`);
      console.log(
        "[DASHBOARD B] Request accepted successfully:",
        response.data
      );
      fetchAllRequests();
    } catch (err: any) {
      console.error("[DASHBOARD B] Error accepting request:", err);
      console.error("[DASHBOARD B] Error response:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  if (selectedRequest) {
    return (
      <Messaging
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
      />
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderRequestList = (
    requests: Request[],
    showAcceptButton: boolean = false
  ) => (
    <List sx={{ mt: 2 }}>
      {requests.map((req) => (
        <ListItem key={req._id} disablePadding>
          <ListItemButton onClick={() => setSelectedRequest(req)}>
            <ListItemText
              primary={`Request from ${
                typeof req.from === "string"
                  ? req.from
                  : req.from.username || req.from.email
              }`}
              secondary={
                req.acceptedBy
                  ? req.responded
                    ? "Responded"
                    : "Accepted - Please respond"
                  : "Pending"
              }
            />
            {showAcceptButton && !req.acceptedBy && (
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  acceptRequest(req._id);
                }}
                sx={{ ml: 2 }}
              >
                Accept
              </Button>
            )}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Container>
      <Typography variant="h4" mt={2}>
        Dashboard B (Responder)
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`Pending Requests (${pendingRequests.length})`} />
          <Tab label={`Accepted Requests (${acceptedRequests.length})`} />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" mt={2}>
            Pending Requests
          </Typography>
          {pendingRequests.length === 0 ? (
            <Typography color="text.secondary" mt={2}>
              No pending requests
            </Typography>
          ) : (
            renderRequestList(pendingRequests, true)
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" mt={2}>
            Accepted Requests
          </Typography>
          {acceptedRequests.length === 0 ? (
            <Typography color="text.secondary" mt={2}>
              No accepted requests
            </Typography>
          ) : (
            renderRequestList(acceptedRequests, false)
          )}
        </Box>
      )}

      <LogoutButton />
    </Container>
  );
};

export default DashboardB;
