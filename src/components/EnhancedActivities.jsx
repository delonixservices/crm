import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  Typography,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  CardActionArea
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL;

const ActivityCard = ({ activity, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="h-full">
      <CardActionArea onClick={() => onSelect(activity)}>
        <img
          src={imageError ? "/api/placeholder/400/140" : activity.image}
          alt={activity.name}
          className="h-36 w-full object-cover"
          onError={() => setImageError(true)}
        />
        <CardContent>
          <Typography className="text-lg font-semibold mb-2">
            {activity.name}
          </Typography>
          <Typography className="text-gray-600 text-sm mb-2">
            {activity.description}
          </Typography>
          <Typography className="text-blue-600 text-sm">
            Price: ₹{activity.price} • Duration: {activity.duration}h
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const ActivitySelector = ({ open, onClose, activities, onSelect, onAddCustom }) => {
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customActivity, setCustomActivity] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: '',
  });

  const handleCustomActivityChange = (field, value) => {
    setCustomActivity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCustomActivity = () => {
    onAddCustom(customActivity);
    setCustomActivity({ name: '', description: '', price: '', duration: '', image: '' });
    setCustomDialogOpen(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Activity</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-2">
            {activities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity.id || activity._id}>
                <ActivityCard 
                  activity={activity} 
                  onSelect={(selected) => {
                    onSelect(selected);
                    onClose();
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDialogOpen(true)}>Add Custom Activity</Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={customDialogOpen} 
        onClose={() => setCustomDialogOpen(false)}
      >
        <DialogTitle>Add Custom Activity</DialogTitle>
        <DialogContent>
          <TextField
            label="Activity Name"
            fullWidth
            margin="normal"
            value={customActivity.name}
            onChange={(e) => handleCustomActivityChange('name', e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={customActivity.description}
            onChange={(e) => handleCustomActivityChange('description', e.target.value)}
          />
          <TextField
            label="Price (₹)"
            fullWidth
            margin="normal"
            value={customActivity.price}
            onChange={(e) => handleCustomActivityChange('price', e.target.value)}
          />
          <TextField
            label="Duration (hours)"
            fullWidth
            margin="normal"
            value={customActivity.duration}
            onChange={(e) => handleCustomActivityChange('duration', e.target.value)}
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={customActivity.image}
            onChange={(e) => handleCustomActivityChange('image', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCustomActivity}>Add</Button>
          <Button onClick={() => setCustomDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const EnhancedActivities = ({ formData, handleChange, selectedCity }) => {
  const [openDay, setOpenDay] = useState(null);
  const [activitySelectorOpen, setActivitySelectorOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState({});

  useEffect(() => {
    const fetchActivities = async () => {
      const destinations = formData.clientInfo.destinationAreas;
      
      if (!destinations || destinations.length === 0) {
        return;
      }

      try {
        const activitiesPromises = destinations.map(async (destination) => {
          const cityName = typeof destination === 'string' ? destination : destination.cityName;
          const url = `${API_URL}/api/cities/${encodeURIComponent(cityName)}/activities`;
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch activities for ${cityName}`);
          }
          
          const data = await response.json();
          return data.activities || [];
        });

        const allActivities = await Promise.all(activitiesPromises);
        const flattenedActivities = allActivities.flat();
        setAvailableActivities(flattenedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setAvailableActivities([]);
      }
    };

    fetchActivities();
  }, [formData.clientInfo.destinationAreas]);

  const handleActivitySelect = (activity, dayIndex) => {
    const activityContent = `Activity: ${activity.name}
Description: ${activity.description}
Price: ₹${activity.price}
Duration: ${activity.duration} hours
Categories: ${activity.selectedCategories ? activity.selectedCategories.join(', ') : ''}`;
    
    setSelectedActivities(prev => ({
      ...prev,
      [dayIndex]: activity
    }));
    
    handleChange("activities", "content", activityContent, dayIndex);
    handleChange("activities", "heading", activity.name, dayIndex);
    handleChange("activities", "image", activity.image, dayIndex);
  };

  const handleAddCustomActivity = (customActivity) => {
    setAvailableActivities((prev) => [...prev, customActivity]);
  };

  return (
    <Card className="mb-4 bg-white shadow-md">
      <CardContent>
        <Typography className="text-xl font-bold mb-4 text-gray-800">
          Daily Activities
        </Typography>
        
        {formData.activities.map((activity, index) => (
          <Box key={index} className="mb-4">
            <Box 
              onClick={() => setOpenDay(openDay === index ? null : index)}
              className="flex items-center cursor-pointer rounded p-2 hover:bg-gray-50"
            >
              <Typography className="flex-grow font-semibold">
                {activity.day}
              </Typography>
              {openDay === index ? <ExpandLess className="w-6 h-6" /> : <ExpandMore className="w-6 h-6" />}
            </Box>
            
            <Collapse in={openDay === index}>
              <Box className="mt-4 p-2">
                {activity.heading && (
                  <>
                    <Typography className="font-bold mb-2">
                      {activity.heading}
                    </Typography>
                    {activity.image && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={activity.image}
                          alt={activity.heading}
                          className="h-32 w-64 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/400/140";
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
                {activity.content && (
                  <Typography className="whitespace-pre-wrap mb-4 text-gray-600">
                    {activity.content}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  onClick={() => {
                    setCurrentDayIndex(index);
                    setActivitySelectorOpen(true);
                  }}
                  disabled={!selectedCity}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {activity.content ? 'Change Activity' : 'Add Activity'}
                </Button>
              </Box>
            </Collapse>
          </Box>
        ))}
      </CardContent>

      <ActivitySelector
        open={activitySelectorOpen}
        onClose={() => setActivitySelectorOpen(false)}
        activities={availableActivities}
        onSelect={(activity) => handleActivitySelect(activity, currentDayIndex)}
        onAddCustom={handleAddCustomActivity}
      />
    </Card>
  );
};

export default EnhancedActivities;
