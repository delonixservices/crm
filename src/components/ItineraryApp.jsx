import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import DestinationSelector from './DestinationSelector';
import HotelInfo from './HotelInfo';
import EnhancedActivities from './EnhancedActivities';
// Keep your existing imports and add:
// import { HotelInfo, EnhancedActivities } from './HotelActivitySelectors';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Collapse,
} from "@mui/material";
import { Add, Remove, ExpandMore, ExpandLess } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_URL;



// Client Information Component
const ClientInfo = ({ formData, handleChange }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6">Client Information</Typography>
      {["proposalName", "name", "phone", "startCity"].map((field) => (
        <TextField
          key={field}
          label={field.replace(/([A-Z])/g, " $1")}
          value={formData.clientInfo[field]}
          onChange={(e) => handleChange("clientInfo", field, e.target.value)}
          fullWidth
          margin="normal"
        />
      ))}
      <DestinationSelector
        value={formData.clientInfo.destinationAreas}
        onChange={(newDestinations) =>
          handleChange("clientInfo", "destinationAreas", newDestinations)
        }
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={formData.clientInfo.startDate}
          onChange={(newValue) => handleChange("clientInfo", "startDate", newValue)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
        <DatePicker
          label="End Date"
          value={formData.clientInfo.endDate}
          onChange={(newValue) => handleChange("clientInfo", "endDate", newValue)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>
    </CardContent>
  </Card>
);



const TravelInsurance = ({ travelInsurance, handleChange }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6">Travel Insurance</Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Do you want to include travel insurance?</FormLabel>
        <RadioGroup
          value={travelInsurance.include}
          onChange={(e) => handleChange("travelInsurance", "include", e.target.value)}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
      {travelInsurance.include === "yes" && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: '#f0f0f0',
            borderRadius: 1
          }}
        >
          Travel Insurance (covering Medical, Baggage Loss, Flight Cancellations or Delays) - Only for Age Below 60 Yrs
        </Typography>
      )}
    </CardContent>
  </Card>
);



// Visa Information Component
const VisaInfo = ({ formData, handleChange }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6">Visa Information</Typography>
      {["type", "notes"].map((field) => (
        <TextField
          key={field}
          label={field.replace(/([A-Z])/g, " $1")}
          value={formData.visa[field]}
          onChange={(e) => handleChange("visa", field, e.target.value)}
          fullWidth
          margin="normal"
        />
      ))}
    </CardContent>
  </Card>
);

// Array Field Component
const ArrayField = ({ title, section, formData, handleArrayChange, addNewField, removeField }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      {formData[section].map((item, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <TextField
            label={`${title} ${index + 1}`}
            value={item}
            onChange={(e) => handleArrayChange(section, index, e.target.value)}
            fullWidth
          />
          <IconButton onClick={() => removeField(section, index)}>
            <Remove />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => addNewField(section)}
        fullWidth
      >
        Add {title}
      </Button>
    </CardContent>
  </Card>
);

// Terms and Conditions Component
const TermsAndConditions = ({ termsAndConditions, handleChange }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6">Add Terms and Conditions</Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Include Terms and Conditions?</FormLabel>
        <RadioGroup
          value={termsAndConditions.include}
          onChange={(e) => handleChange("termsAndConditions", "include", e.target.value)}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
      {termsAndConditions.include === "yes" && (
        <TextField
          label="Terms and Conditions"
          value={termsAndConditions.text}
          onChange={(e) => handleChange("termsAndConditions", "text", e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      )}
    </CardContent>
  </Card>
);

// Main Itinerary App Component
export default function ItineraryApp() {
  const navigate = useNavigate(); // Add this line
  const [selectedCity, setSelectedCity] = useState(""); // Move inside component
  const [formData, setFormData] = useState({
    clientInfo: {
      proposalName: "",
      name: "",
      phone: "",
      startCity: "",
      destinationAreas: [],
      startDate: null,
      endDate: null,
    },
    flights: [""],
    hotelInfo: {
      hotels: [], // Array to store multiple hotels
    },
    activities: [],
    inclusions: [""],
    visa: { type: "", notes: "" },
    exclusions: [""],
    termsAndConditions: {
      include: "no",
      text: "",
    },
    travelInsurance: {
      include: "no",
    },
  });

  // Automatically generate activities based on the date range
  useEffect(() => {
    const { startDate, endDate } = formData.clientInfo;
    if (startDate && endDate) {
      const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
      const newActivities = Array.from({ length: days }, (_, index) => ({
        day: `Day ${index + 1}`,
        heading: "",
        content: ""
      }));
      setFormData((prevData) => ({
        ...prevData,
        activities: newActivities,
      }));
    }
  }, [formData.clientInfo.startDate, formData.clientInfo.endDate]);


  const handleChange = (section, key, value, index = null) => {
    setFormData((prevData) => {
      if (index !== null) {
        const updatedSection = [...prevData[section]];
        if (section === 'activities') {
          updatedSection[index] = {
            ...updatedSection[index],
            [key]: value
          };
        } else {
          updatedSection[index] = value;
        }
        return { ...prevData, [section]: updatedSection };
      }
      if (typeof prevData[section] === "object" && !Array.isArray(prevData[section])) {
        return {
          ...prevData,
          [section]: { ...prevData[section], [key]: value },
        };
      }
      return prevData;
    });
  };

  const handleArrayChange = (section, index, value) => {
    setFormData((prevData) => {
      const updatedArray = [...prevData[section]];
      updatedArray[index] = value;
      return { ...prevData, [section]: updatedArray };
    });
  };

  const addNewField = (section) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: [...prevData[section],
      section === "activities"
        ? { day: `Day ${prevData[section].length + 1}`, heading: "", content: "" }
        : ""
      ],
    }));
  };

  const removeField = (section, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: prevData[section].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { proposalName, name, phone, startDate, endDate } = formData.clientInfo;
  
    // Validate required fields
    if (!name || !phone || !proposalName) {
      alert("Please fill out all required client information fields.");
      return;
    }
  
    // Create a deep copy of formData to modify
    const submitData = JSON.parse(JSON.stringify({
      ...formData,
      clientInfo: {
        ...formData.clientInfo,
        // Transform destinationAreas to array of strings (cityNames)
        destinationAreas: formData.clientInfo.destinationAreas.map(dest => 
          typeof dest === 'string' ? dest : dest.cityName
        ),
        // Convert Dayjs objects to ISO strings
        startDate: formData.clientInfo.startDate ? dayjs(formData.clientInfo.startDate).toISOString() : null,
        endDate: formData.clientInfo.endDate ? dayjs(formData.clientInfo.endDate).toISOString() : null
      }
    }));
  
    // Ensure activities array is properly formatted
    submitData.activities = submitData.activities.map(activity => ({
      day: activity.day || '',
      heading: activity.heading || '',
      content: activity.content || '',
      image: activity.image || ''
    }));
  
    // Ensure hotelInfo is properly structured
    if (!submitData.hotelInfo.hotels) {
      submitData.hotelInfo.hotels = [];
    }
  
    // Clean up empty arrays and null values
    submitData.flights = submitData.flights.filter(flight => flight);
    submitData.inclusions = submitData.inclusions.filter(inclusion => inclusion);
    submitData.exclusions = submitData.exclusions.filter(exclusion => exclusion);
  
    try {
      const response = await fetch(`${API_URL}/api/proposals`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      
      // Navigate to the proposal view using the returned ID
      if (result._id) {
        navigate(`/proposals/${result._id}`);
      } else {
        throw new Error('No proposal ID returned from server');
      }
  
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Failed to submit itinerary: ${error.message}`);
    }
  };

  useEffect(() => {
    console.log("Selected City:", formData.clientInfo.startCity);
    setSelectedCity(formData.clientInfo.startCity);
  }, [formData.clientInfo.startCity]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 3,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 3,
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          Travel Itinerary Planner
        </Typography>
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ClientInfo formData={formData} handleChange={handleChange} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ArrayField
              title="Flights"
              section="flights"
              formData={formData}
              handleArrayChange={handleArrayChange}
              addNewField={addNewField}
              removeField={removeField}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <HotelInfo
              formData={formData}
              handleChange={handleChange}
              selectedCity={formData.clientInfo.startCity}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
             <EnhancedActivities
              formData={formData}
              handleChange={handleChange}
              selectedCity={formData.clientInfo.destinationAreas[0]} // Pass the first destination or handle multiple
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <ArrayField
              title="Inclusions"
              section="inclusions"
              formData={formData}
              handleArrayChange={handleArrayChange}
              addNewField={addNewField}
              removeField={removeField}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <VisaInfo formData={formData} handleChange={handleChange} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <ArrayField
              title="Exclusions"
              section="exclusions"
              formData={formData}
              handleArrayChange={handleArrayChange}
              addNewField={addNewField}
              removeField={removeField}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <TermsAndConditions
              termsAndConditions={formData.termsAndConditions}
              handleChange={handleChange}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <TravelInsurance
              travelInsurance={formData.travelInsurance}
              handleChange={handleChange}
            />
          </motion.div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              py: 2,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Submit Itinerary
          </Button>
        </form>
      </Box>
    </LocalizationProvider>
  );
}