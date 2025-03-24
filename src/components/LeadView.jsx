import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Container,
  Paper,
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import EditHistory from "./EditHistory";
import LeadViewEdit from "./LeadViewEdit";

const API_URL = import.meta.env.VITE_API_URL;

// Helper: Format date to "DD-MM-YYYY"
const formatMongoDate = (dateString) => {
  if (!dateString) return null;
  try {
    const parsedDate = dayjs(dateString, ["YYYY-MM-DD", "DD-MM-YYYY"]);
    return parsedDate.isValid() ? parsedDate.format("DD-MM-YYYY") : null;
  } catch (error) {
    console.error("Date parsing error:", error);
    return null;
  }
};

// Helper: Format date & time to "DD-MM-YYYY HH:mm"
const formatDateTime = (dateString) => {
  if (!dateString) return null;
  try {
    const parsedDate = dayjs(dateString);
    return parsedDate.isValid() ? parsedDate.format("DD-MM-YYYY HH:mm") : null;
  } catch (error) {
    console.error("DateTime parsing error:", error);
    return null;
  }
};

function LeadView() {
  const chatContainerRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sequenceId = queryParams.get("sequenceId");

  // States for current lead and overall leads list (for navigation)
  const [lead, setLead] = useState(null);
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editHistory, setEditHistory] = useState([]);

  // Fetch individual lead details; updatedAt is formatted with time.
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leads/${id}`);
        if (!response.ok) throw new Error("Failed to fetch lead data");
        const data = await response.json();
        const formattedLead = {
          ...data,
          dateOfTravel: data.dateOfTravel ? formatMongoDate(data.dateOfTravel) : null,
          dateofCreation: data.dateofCreation ? formatMongoDate(data.dateofCreation) : null,
          // Use updatedAt for updated timestamp with time; fallback to timestamp.
          updatedAt: data.updatedAt
            ? formatDateTime(data.updatedAt)
            : (data.timestamp ? formatDateTime(data.timestamp) : null)
        };
        setLead({ ...formattedLead, sequenceId });
        if (data.editHistory) {
          setEditHistory(data.editHistory);
        }
      } catch (err) {
        console.error("Error in fetchLead:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id, sequenceId]);

  // Fetch messages for the current lead
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leads/${id}/messages`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        // Sort messages by timestamp in descending order
        const sortedMessages = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setMessages(sortedMessages);
      } catch (err) {
        console.error("Fetch messages error:", err);
        setError(err.message);
      }
    };
    fetchMessages();
  }, [id]);

  // Reset chat scroll position when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  // Save updated lead details
  const handleSave = async (updatedLead) => {
    try {
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLead)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save lead data");
      }
      const savedLead = await response.json();
      const formattedSavedLead = {
        ...savedLead,
        dateOfTravel: formatMongoDate(savedLead.dateOfTravel),
        dateofCreation: formatMongoDate(savedLead.dateofCreation),
        updatedAt: savedLead.updatedAt
          ? formatDateTime(savedLead.updatedAt)
          : (savedLead.timestamp ? formatDateTime(savedLead.timestamp) : null)
      };
      setLead(formattedSavedLead);
      setIsEditing(false);
      setSuccessMessage("Lead saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Save lead error:", err);
      setError(err.message);
    }
  };

  // Fetch the full list of leads and sort by updatedAt (or timestamp) in descending order
  useEffect(() => {
    const fetchLeadsList = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leads`);
        if (!response.ok) throw new Error("Failed to fetch leads list");
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.leads || [];
        // Sort by updatedAt descending (latest updated first), fallback to timestamp if needed
        const sortedList = list.sort(
          (a, b) => new Date(b.updatedAt || b.timestamp) - new Date(a.updatedAt || a.timestamp)
        );
        setLeadsList(sortedList);
      } catch (err) {
        console.error("Error fetching leads list:", err);
      }
    };
    fetchLeadsList();
  }, []);

  // Determine the current lead's index in the sorted leads list
  const currentIndex = leadsList.findIndex((item) => item._id === id);

  // Next/Previous navigation handlers using the updated timestamp order
  const handleNext = () => {
    if (currentIndex !== -1 && currentIndex < leadsList.length - 1) {
      const nextId = leadsList[currentIndex + 1]._id;
      navigate(`/lead-details/${nextId}?sequenceId=${currentIndex + 1}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevId = leadsList[currentIndex - 1]._id;
      navigate(`/lead-details/${prevId}?sequenceId=${currentIndex - 1}`);
    }
  };

  // Handle adding a new message
  const handleAddMessage = async () => {
    if (!newMessage.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    const payload = {
      user: id,
      message: newMessage.trim(),
      timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss")
    };
    try {
      const response = await fetch(`${API_URL}/api/leads/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.error || "Failed to send message");
      }
      const savedMessage = await response.json();
      setMessages((prev) => [savedMessage, ...prev]);
      setNewMessage("");
    } catch (err) {
      console.error("Add message error:", err);
      setError(err.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const fieldConfig = [
    { field: "name", label: "Name" },
    { field: "contact", label: "Contact" },
    { field: "email", label: "Email" },
    { field: "dateOfTravel", label: "Date Of Travel", type: "date" },
    { field: "destination", label: "Destination" },
    { field: "numberofPacks", label: "Number of Packs" },
    { field: "numberofDays", label: "Number of days" },
    { field: "departureCity", label: "Departure City" },
    { field: "budget", label: "Budget" },
    {
      field: "leadSource",
      label: "Lead Source",
      options: ["Google", "Referral", "Social Media", "Meta"]
    },
    {
      field: "assignee",
      label: "Assignee",
      options: [
        "Vijay",
        "Naveen",
        "Vishwavijay",
        "Karan",
        "Amit Jaiswal",
        "Pratham",
        "Lakshya",
        "Aash",
        "Employee1",
        "Employee2",
        "Unassigned"
      ]
    },
    {
      field: "leadStatus",
      label: "Lead Status",
      options: ["New", "Warm", "Cold", "Converted", "Cancelled", "Closed", "Open", "Duplicate"]
    },
    {
      field: "verificationStatus",
      label: "Verification Status",
      options: ["Yes", "No"]
    },
    {
      field: "needOfFlight",
      label: "Need Flight",
      options: ["Yes", "No"]
    },
    { field: "dateofCreation", label: "Date of Creation", readOnly: true },
    { field: "updatedAt", label: "Updated At", readOnly: true },
    { field: "notes", label: "Notes" }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {isEditing ? (
        <LeadViewEdit lead={lead} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper elevation={6} sx={{ p: 3, backgroundColor: "#f5f5f5", borderRadius: 3 }}>
            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  Lead Details
                </Typography>
                {sequenceId && (
                  <Typography variant="subtitle1" sx={{ color: "#555" }}>
                    Sequence ID: {sequenceId}
                  </Typography>
                )}
              </Box>
              <Box display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => navigate("/leads")}>
                  <CloseIcon />
                </Button>
              </Box>
            </Box>

            {/* Next and Previous Navigation Buttons */}
            <Box display="flex" justifyContent="center" gap={2} mb={3}>
              <Button variant="contained" color="secondary" onClick={handlePrevious} disabled={currentIndex <= 0}>
                Previous
              </Button>
              <Button variant="contained" color="secondary" onClick={handleNext} disabled={currentIndex === -1 || currentIndex === leadsList.length - 1}>
                Next
              </Button>
            </Box>

            <Box sx={{ padding: 2, backgroundColor: "white", borderRadius: 2 }}>
              <Grid container spacing={3}>
                {fieldConfig.map(({ field, label, type = "text", options, readOnly }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    {field === "contact" ? (
                      <Box display="flex" alignItems="center" gap={2} sx={{ backgroundColor: "#f0f0f0", padding: 2, borderRadius: 2 }}>
                        <Typography sx={{ color: "#333", fontWeight: "bold" }}>
                          <strong>{label}:</strong> {lead?.[field] || "N/A"}
                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          href={`https://wa.me/${lead?.[field]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<WhatsAppIcon />}
                          sx={{ fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`tel:${lead?.[field]}`}
                          startIcon={<PhoneIcon />}
                          sx={{ fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                        >
                          Call
                        </Button>
                      </Box>
                    ) : (
                      <TextField
                        label={label}
                        value={lead?.[field] || ""}
                        disabled={true}
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            color: "#333"
                          }
                        }}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#1a1a1a", mb: 2 }}>
                Messages
              </Typography>
              <Box
                ref={chatContainerRef}
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <List>
                  {messages.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" align="center">
                      No messages yet
                    </Typography>
                  ) : (
                    messages.map((message, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ backgroundColor: index % 2 === 0 ? "#f0f0f0" : "white", borderRadius: 2, mb: 1 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ color: "#333", fontWeight: "medium" }}>
                                {message.message}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: "#666" }}>
                                {dayjs(message.timestamp).format("DD MMM YYYY, HH:mm")}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < messages.length - 1 && <Divider variant="inset" />}
                      </React.Fragment>
                    ))
                  )}
                </List>
              </Box>
              <Box display="flex" gap={2}>
                <TextField
                  variant="outlined"
                  label="Type your message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth
                  multiline
                  maxRows={4}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      color: "#333"
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddMessage}
                  sx={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    alignSelf: "flex-start",
                    mt: 1
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      )}
    </LocalizationProvider>
  );
}

export default LeadView;
         