import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../api/api";
import "../styles/ResponderDashboard.css";

interface Message {
  _id: string;
  senderType: "A" | "B";
  content: string;
  createdAt: string;
}

interface Request {
  _id: string;
  description: string;
  requester: { name: string; email: string };
  responders: { _id: string; name: string }[];
  status: string;
  createdAt: string;
}

const ResponderDashboard: React.FC = () => {
  const [pending, setPending] = useState<Request[]>([]);
  const [accepted, setAccepted] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchPending = async () => {
    try {
      const res = await API.get("/requests/pending");
      setPending(res.data);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    }
  };

  const fetchAccepted = async () => {
    try {
      const res = await API.get("/requests/accepted");
      setAccepted(res.data);
    } catch (err) {
      console.error("Error fetching accepted requests:", err);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await API.get(`/messages/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchAccepted();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await API.post(`/requests/${id}/accept`);
      fetchPending();
      fetchAccepted();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

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
        {/* Pending Requests */}
        <section className="card-section">
          <h2>📩 Pending Requests</h2>
          {pending.map((req) => (
            <div key={req._id} className="request-card">
              <h4>{req.description}</h4>
              <p>
                <strong>Requester:</strong> {req.requester.name} (
                {req.requester.email})
              </p>
              <button className="accept-btn" onClick={() => handleAccept(req._id)}>
                Accept
              </button>
            </div>
          ))}
        </section>

        {/* Active Conversations */}
        <section className="card-section">
          <h2>💬 Active Conversations</h2>
          {accepted.map((req) => (
            <div
              key={req._id}
              className="conversation-card"
              onClick={() => {
                setSelectedRequest(req);
                fetchMessages(req._id);
              }}
            >
              <h4>{req.description}</h4>
              <p>
                <strong>Requester:</strong> {req.requester.name}
              </p>
            </div>
          ))}
        </section>

        {/* Chat Section */}
        {selectedRequest && (
          <section className="chat-box">
            <h3>Chat with {selectedRequest.requester.name}</h3>
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`msg ${msg.senderType === "B" ? "me" : "other"}`}
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
                placeholder="Type your reply..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResponderDashboard;
