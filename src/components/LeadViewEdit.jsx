import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Alert,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { X as CloseIcon, Phone as PhoneIcon, MessageSquare as WhatsAppIcon } from "lucide-react";
import dayjs from 'dayjs';

const LeadViewEdit = ({ lead, onSave, onCancel }) => {
  const [editedLead, setEditedLead] = useState(lead);
  const [changes, setChanges] = useState([]);
  const [error, setError] = useState(null);

  const trackChanges = (field, oldValue, newValue) => {
    if (oldValue === newValue) return;
  
    const change = {
      field,
      oldValue: oldValue?.toString() || 'Not set',
      newValue: newValue?.toString() || 'Not set',
      timestamp: new Date().toISOString()
    };
  
    if (field === 'dateOfTravel' || field === 'dateofCreation') {
      change.oldValue = oldValue || 'Not set';
      change.newValue = newValue || 'Not set';
    }
  
    setChanges(prev => [...prev, change]);
  };

  const handleInputChange = (field, value) => {
    const oldValue = editedLead[field];
    setEditedLead(prev => ({
      ...prev,
      [field]: value
    }));
    trackChanges(field, oldValue, value);
  };

  const handleSave = () => {
    try {
      const processedLead = {
        ...editedLead,
        timestamp: new Date().toISOString(),
        dateOfTravel: editedLead.dateOfTravel ? 
          dayjs(editedLead.dateOfTravel, "DD-MM-YYYY").format("YYYY-MM-DD") : 
          null,
        dateofCreation: editedLead.dateofCreation ? 
          dayjs(editedLead.dateofCreation, "DD-MM-YYYY").format("YYYY-MM-DD") : 
          null,
          lastEdited: {
            timestamp: new Date().toISOString(),
            changes: changes.map(change => ({
              ...change,
              timestamp: new Date().toISOString()
            }))
          }
      };
      
      onSave(processedLead);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add the renderDatePicker function here
  const renderDatePicker = (field, label, readOnly) => (
    <DatePicker
      label={label}
      value={editedLead[field] ? dayjs(editedLead[field], ["DD-MM-YYYY", "YYYY-MM-DD"]) : null}
      onChange={(newValue) => {
        if (!newValue || !newValue.isValid()) {
          handleInputChange(field, null);
          return;
        }
        const formattedDate = newValue.format("DD-MM-YYYY");
        handleInputChange(field, formattedDate);
      }}
      disabled={readOnly}
      sx={{ width: '100%' }}
      slotProps={{
        textField: {
          fullWidth: true,
          sx: { bgcolor: 'white' }
        }
      }}
    />
  );

  // Field configurations
  const fields = [
    { field: "name", label: "Name" },
    { field: "contact", label: "Contact" },
    { field: "email", label: "Email" },
    { field: "dateOfTravel", label: "Date Of Travel", type: "date" },
    { field: "destination", label: "Destination" },
    { field: "numberofPacks", label: "Number of Packs" },
    { field: "numberofDays", label: "Number of Days" },
    { field: "departureCity", label: "Departure City" },
    { field: "budget", label: "Budget" },
    { field: "leadSource", label: "Lead Source", options: ["Google", "Referral", "Social Media", "Meta"] },
    { field: "assignee", label: "Assignee", options: ["Vijay", "Naveen", "Vishwavijay","Karan","Amit Jaiswal","Pratham","Lakshya","Aash","Employee 1","Employee 2","Unassigned"] },
    { field: "leadStatus", label: "Lead Status", options: ["New", "Warm", "Cold", "Converted", "Cancelled", "Closed", "Open","Duplicate"] },
    { field: "verificationStatus", label: "Verification Status", options: ["Yes", "No"] },
    { field: "needOfFlight", label: "Need Flight", options: ["Yes", "No"] },
    { field: "dateofCreation", label: "Date of Creation", readOnly: true },
    { field: "timestamp", label: "Date of Upload", readOnly: true },
    { field: "notes", label: "Notes"},

  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: 'grey.50' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1
          }}>
            <Typography variant="h5" fontWeight="bold">
              Edit Lead Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={onCancel} variant="contained" color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => navigate("/leads")}
                variant="contained"
                color="error"
                sx={{ minWidth: 'auto', p: 1 }}
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {fields.map(({ field, label, type, options, readOnly }) => (
              <Grid item xs={12} sm={6} key={field}>
                {field === "contact" ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1
                  }}>
                    <TextField
                      label={label}
                      value={editedLead[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      fullWidth
                      disabled={readOnly}
                      sx={{ bgcolor: 'white' }}
                    />
                    <Button
                      href={`https://wa.me/${editedLead[field]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      color="success"
                      startIcon={<WhatsAppIcon />}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      href={`tel:${editedLead[field]}`}
                      variant="contained"
                      color="primary"
                      startIcon={<PhoneIcon />}
                    >
                      Call
                    </Button>
                  </Box>
                ) : field === "dateOfTravel" ? (
                  renderDatePicker(field, label, readOnly)
                ) : options ? (
                  <TextField
                    select
                    label={label}
                    value={editedLead[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    fullWidth
                    disabled={readOnly}
                    sx={{ bgcolor: 'white' }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    label={label}
                    value={editedLead[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    fullWidth
                    disabled={readOnly}
                    sx={{ bgcolor: 'white' }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default LeadViewEdit;