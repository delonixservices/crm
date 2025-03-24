import React, { useState } from 'react';
import { Button, TextField, Box, Card, CardContent, Typography } from '@mui/material';
import { HotelSelector, ActivitySelector } from './HotelActivitySelectors';

const HotelInfo = ({ formData, handleChange, selectedCity }) => {
  const [openHotelDialog, setOpenHotelDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    handleChange("hotelInfo", "name", hotel.name);
    handleChange("hotelInfo", "address", hotel.description);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Hotel Information</Typography>
        {selectedHotel ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Selected Hotel: {selectedHotel.name}</Typography>
            <Typography variant="body2">Rating: {selectedHotel.starRating} stars</Typography>
            <Typography variant="body2">Price: ₹{selectedHotel.price} per night</Typography>
            <Typography variant="body2">Meal Plan: {selectedHotel.mealPlan}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No hotel selected</Typography>
        )}
        
        <Button 
          variant="contained" 
          onClick={() => setOpenHotelDialog(true)}
          sx={{ mt: 2 }}
          disabled={!selectedCity}
        >
          {selectedHotel ? 'Change Hotel' : 'Select Hotel'}
        </Button>

        <HotelSelector
          open={openHotelDialog}
          onClose={() => setOpenHotelDialog(false)}
          selectedCity={selectedCity}
          onSelect={handleHotelSelect}
        />
      </CardContent>
    </Card>
  );
};

const EnhancedActivities = ({ formData, handleChange, selectedCity }) => {
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState(null);
  
  const handleActivitySelect = (activities, dayNumber) => {
    // Format selected activities into a string
    const activityString = activities
      .map(activity => `${activity.name} (${activity.duration} hrs) - ₹${activity.price}`)
      .join('\n');
    
    handleChange("activities", "content", activityString, dayNumber - 1);
    handleChange(
      "activities", 
      "heading", 
      `Day ${dayNumber} Activities`, 
      dayNumber - 1
    );
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Daily Activities</Typography>
        {formData.activities.map((activity, index) => (
          <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle1">{activity.day}</Typography>
            {activity.content ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {activity.content}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No activities selected</Typography>
            )}
            
            <Button 
              variant="contained" 
              onClick={() => {
                setSelectedDayNumber(index + 1);
                setOpenActivityDialog(true);
              }}
              sx={{ mt: 2 }}
              disabled={!selectedCity}
            >
              {activity.content ? 'Change Activities' : 'Select Activities'}
            </Button>
          </Box>
        ))}

        <ActivitySelector
          open={openActivityDialog}
          onClose={() => setOpenActivityDialog(false)}
          selectedCity={selectedCity}
          onSelect={handleActivitySelect}
          dayNumber={selectedDayNumber}
        />
      </CardContent>
    </Card>
  );
};

export { HotelInfo, EnhancedActivities };