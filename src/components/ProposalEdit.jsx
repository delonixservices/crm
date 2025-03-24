
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Grid, 
  Alert,
  Paper, 
  IconButton, 
  Checkbox, 
  FormControlLabel
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const ProposalEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Comprehensive initial state
  const [proposal, setProposal] = useState({
    clientInfo: {
      proposalName:'',
      name: '',
      phone: '',
      startDate: '',
      endDate: '',
      startCity: '',
      destinationArea: ''
    },
    flights: [''], // Initialize with one empty flight
    hotelInfo: {
      name: '',
      address: ''
    },
    activities: [{ 
      day: '', 
      heading: '', 
      content: '' 
    }], // Initialize with one empty activity
    inclusions: [''], // Initialize with one empty inclusion
    exclusions: [''], // Initialize with one empty exclusion
    visa: {
      type: '',
      notes: ''
    },
    termsAndConditions: {
      include: 'no',
      text: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        if (!import.meta.env.VITE_API_URL) {
          throw new Error('API URL is not configured');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proposals/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch proposal');
        }

        const data = await response.json();
        setProposal(prevProposal => ({
          ...prevProposal,
          ...data,
          // Ensure arrays always have at least one empty item if empty
          flights: data.flights && data.flights.length ? data.flights : [''],
          inclusions: data.inclusions && data.inclusions.length ? data.inclusions : [''],
          exclusions: data.exclusions && data.exclusions.length ? data.exclusions : [''],
          activities: data.activities && data.activities.length 
            ? data.activities 
            : [{ day: '', heading: '', content: '' }],
          termsAndConditions: data.termsAndConditions || {
            include: 'no',
            text: ''
          }
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching proposal:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProposal();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Generic handler for nested object changes
  const handleNestedChange = (section, index, field, value) => {
    setProposal(prev => {
      const updatedSection = [...prev[section]];
      updatedSection[index] = {
        ...updatedSection[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  // Generic handler for array-based fields
  const handleArrayChange = (section, index, value) => {
    setProposal(prev => {
      const updatedSection = [...prev[section]];
      updatedSection[index] = value;
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  // Add new item to array-based fields
  const addArrayItem = (section) => {
    setProposal(prev => ({
      ...prev,
      [section]: [...prev[section], section === 'activities' 
        ? { day: '', heading: '', content: '' } 
        : '']
    }));
  };

  // Remove item from array-based fields
  const removeArrayItem = (section, index) => {
    setProposal(prev => {
      const updatedSection = prev[section].filter((_, i) => i !== index);
      // Ensure at least one empty item remains
      return {
        ...prev,
        [section]: updatedSection.length ? updatedSection : 
          (section === 'activities' 
            ? [{ day: '', heading: '', content: '' }]
            : [''])
      };
    });
  };

  // Handle client info and other top-level changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested clientInfo
    if (name.startsWith('clientInfo.')) {
      const clientInfoField = name.split('.')[1];
      setProposal(prev => ({
        ...prev,
        clientInfo: {
          ...prev.clientInfo,
          [clientInfoField]: value
        }
      }));
    } 
    // Handle nested objects
    else if (name.startsWith('hotelInfo.') || name.startsWith('visa.')) {
      const [section, field] = name.split('.');
      setProposal(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
    // Handle terms and conditions
    else if (name.startsWith('termsAndConditions.')) {
      const field = name.split('.')[1];
      setProposal(prev => ({
        ...prev,
        termsAndConditions: {
          ...prev.termsAndConditions,
          [field]: value
        }
      }));
    }
    // Handle other changes
    else {
      setProposal(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty array items before submission
      const cleanedProposal = {
        ...proposal,
        flights: proposal.flights.filter(f => f.trim()),
        inclusions: proposal.inclusions.filter(i => i.trim()),
        exclusions: proposal.exclusions.filter(e => e.trim()),
        activities: proposal.activities.filter(a => a.day.trim() || a.heading.trim() || a.content.trim())
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proposals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedProposal)
      });

      if (!response.ok) {
        throw new Error('Failed to update proposal');
      }

      navigate(`/proposal-view/${id}`);
    } catch (error) {
      console.error('Error updating proposal:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Error: {error}
          <br />
          Please check your API configuration and try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 2 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          backgroundColor: 'white',
          borderRadius: 2 
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              color: '#333', 
              fontWeight: 'bold',
              marginBottom: 3 
            }}
          >
            Edit Proposal
          </Typography>

          {/* Client Information */}
          <Typography variant="h6" sx={{ mb: 2 }}>Client Information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>

            <TextField
                fullWidth
                label="Proposal Name"
                name="clientInfo.proposalName"
                value={proposal.clientInfo.proposalName || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Client Name"
                name="clientInfo.name"
                value={proposal.clientInfo.name || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Phone"
                name="clientInfo.phone"
                value={proposal.clientInfo.phone || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start City"
                name="clientInfo.startCity"
                value={proposal.clientInfo.startCity || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Destination"
                name="clientInfo.destinationArea"
                value={proposal.clientInfo.destinationArea || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="clientInfo.startDate"
                value={proposal.clientInfo.startDate 
                  ? new Date(proposal.clientInfo.startDate).toISOString().split('T')[0] 
                  : ''
                }
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="clientInfo.endDate"
                value={proposal.clientInfo.endDate 
                  ? new Date(proposal.clientInfo.endDate).toISOString().split('T')[0] 
                  : ''
                }
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Flights */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Flights</Typography>
          {proposal.flights.map((flight, index) => (
            <Grid container key={index} spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label={`Flight ${index + 1}`}
                  value={flight}
                  onChange={(e) => handleArrayChange('flights', index, e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2}>
                <Box display="flex" alignItems="center">
                  <IconButton 
                    color="error" 
                    onClick={() => removeArrayItem('flights', index)}
                    disabled={proposal.flights.length <= 1}
                  >
                    <Delete />
                  </IconButton>
                  {index === proposal.flights.length - 1 && (
                    <IconButton 
                      color="primary" 
                      onClick={() => addArrayItem('flights')}
                    >
                      <Add />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          ))}

          {/* Hotel Information */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Hotel Information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hotel Name"
                name="hotelInfo.name"
                value={proposal.hotelInfo.name || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hotel Address"
                name="hotelInfo.address"
                value={proposal.hotelInfo.address || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Activities */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Daily Activities</Typography>
          {proposal.activities.map((activity, index) => (
            <Grid container key={index} spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Day"
                  value={activity.day}
                  onChange={(e) => handleNestedChange('activities', index, 'day', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Heading"
                  value={activity.heading}
                  onChange={(e) => handleNestedChange('activities', index, 'heading', e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={3}
                  value={activity.content}
                  onChange={(e) => handleNestedChange('activities', index, 'content', e.target.value)}
                  variant="outlined"
                />
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <IconButton 
                    color="error" 
                    onClick={() => removeArrayItem('activities', index)}
                    disabled={proposal.activities.length <= 1}
                  >
                    <Delete />
                  </IconButton>
                  {index === proposal.activities.length - 1 && (
                    <IconButton 
                      color="primary" 
                      onClick={() => addArrayItem('activities')}
                    >
                      <Add />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          ))}

          {/* Inclusions */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Inclusions</Typography>
          {proposal.inclusions.map((inclusion, index) => (
  <Grid container key={index} spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={10}>
      <TextField
        fullWidth
        label={`Inclusion ${index + 1}`}
        value={inclusion}
        onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
        variant="outlined"
      />
    </Grid>
    <Grid item xs={2}>
      <Box display="flex" alignItems="center">
        <IconButton 
          color="error" 
          onClick={() => removeArrayItem('inclusions', index)}
          disabled={proposal.inclusions.length <= 1}
        >
          <Delete />
        </IconButton>
        {index === proposal.inclusions.length - 1 && (
          <IconButton 
            color="primary" 
            onClick={() => addArrayItem('inclusions')}
          >
            <Add />
          </IconButton>
        )}
      </Box>
    </Grid>
  </Grid>
))}

          {/* Exclusions */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Exclusions</Typography>
          {proposal.exclusions.map((exclusion, index) => (
            <Grid container key={index} spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label={`Exclusion ${index + 1}`}
                  value={exclusion}
                  onChange={(e) => handleArrayChange('exclusions', index, e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2}>
                <Box display="flex" alignItems="center">
                  <IconButton 
                    color="error" 
                    onClick={() => removeArrayItem('exclusions', index)}
                    disabled={proposal.exclusions.length <= 1}
                  >
                    <Delete />
                  </IconButton>
                  {index === proposal.exclusions.length - 1 && (
                    <IconButton 
                      color="primary" 
                      onClick={() => addArrayItem('exclusions')}
                    >
                      <Add />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          ))}

          {/* Visa Information */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Visa Information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Visa Type"
                name="visa.type"
                value={proposal.visa.type || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Visa Notes"
                name="visa.notes"
                value={proposal.visa.notes || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Terms and Conditions */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Terms and Conditions</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={proposal.termsAndConditions.include === 'yes'}
                    onChange={(e) => handleChange({
                      target: {
                        name: 'termsAndConditions.include',
                        value: e.target.checked ? 'yes' : 'no'
                      }
                    })}
                  />
                }
                label="Include Terms and Conditions"
              />
            </Grid>
            {proposal.termsAndConditions.include === 'yes' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Terms and Conditions Text"
                  name="termsAndConditions.text"
                  value={proposal.termsAndConditions.text || ''}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
            )}
          </Grid>

          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
            >
              Update Proposal
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProposalEdit;