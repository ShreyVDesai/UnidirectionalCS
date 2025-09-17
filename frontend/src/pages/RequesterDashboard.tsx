import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import API from "../api/api";
import "../styles/RequesterDashboard.css";

interface Message {
  _id: string;
  senderType: "A" | "B";
  content: string;
  createdAt: string;
}

interface Request {
  _id: string;
  description: string;
  status: string;
  responders: { _id: string; name: string }[];
  createdAt: string;
}

const RequesterDashboard: React.FC = () => {
  const [newRequest, setNewRequest] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeConversations, setActiveConversations] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch my requests
  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/requests/my");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching my requests:", err);
    }
  };

  // Fetch active conversations
  const fetchActiveConversations = async () => {
    try {
      const res = await API.get("/requests/active");
      setActiveConversations(res.data);
    } catch (err) {
      console.error("Error fetching active conversations:", err);
    }
  };

  // Fetch messages for selected request
  const fetchMessages = async (id: string) => {
    try {
      const res = await API.get(`/messages/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMyRequests();
    fetchActiveConversations();
  }, []);

  // Send new request
  const handleSendRequest = async () => {
    if (!newRequest.trim()) return alert("Please enter a request");
    try {
      await API.post("/requests", { description: newRequest });
      setNewRequest("");
      fetchMyRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!selectedRequest || !newMessage.trim()) return;
    try {
      await API.post(`/messages/send/${selectedRequest._id}`, {
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages(selectedRequest._id);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      <Header />
      <div className="dashboard">
        {/* New Request */}
        <section className="new-request">
          <h3>Send New Request</h3>
          <textarea
            placeholder="Describe your request..."
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
          />
          <button onClick={handleSendRequest}>Send Request</button>
        </section>

        {/* Active Conversations */}
        <section className="conversations">
          <h3>Active Conversations</h3>
          {activeConversations.length === 0 && <p>No active conversations yet</p>}
          {activeConversations.map((req) => (
            <div
              key={req._id}
              className="conversation-card"
              onClick={() => {
                setSelectedRequest(req);
                fetchMessages(req._id);
              }}
            >
              <h4>{req.description}</h4>
              <p>Responders: {req.responders.map((r) => r.name).join(", ")}</p>
            </div>
          ))}
        </section>

        {/* Chat Section */}
        {selectedRequest && (
          <section className="chat-box">
            <h3>Chat with responders</h3>
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`msg ${msg.senderType === "A" ? "me" : "other"}`}
                >
                  <p>{msg.content}</p>
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </section>
        )}

        {/* My Requests */}
        <section className="my-requests">
          <h3>My Requests</h3>
          {requests.map((req) => (
            <div key={req._id} className="request-card">
              <h4>
                {req.description} <span className="badge">{req.status}</span>
              </h4>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default RequesterDashboard;
