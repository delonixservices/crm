

// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Button,
//   Box,
//   Grid,
//   Rating,
//   DialogActions,
//   Chip,
//   Alert,
//   CircularProgress,
//   TextField,
//   IconButton,
// } from '@mui/material';
// import { Add, Delete } from '@mui/icons-material';



// const HotelInfo = ({ formData, handleChange }) => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [hotelsByCity, setHotelsByCity] = useState({});
//   const [selectedHotels, setSelectedHotels] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [dialogSelectedCity, setDialogSelectedCity] = useState('');
//   const [customHotels, setCustomHotels] = useState([]);
//   const [customHotelInput, setCustomHotelInput] = useState('');
//   const [customHotelDescription, setCustomHotelDescription] = useState('');

//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchHotelsForAllCities = async () => {
//       const destinations = formData.clientInfo.destinationAreas;
//       if (!destinations || destinations.length === 0) return;

//       setLoading(true);
//       setError(null);
//       const newHotelsByCity = {};

//       try {
//         for (const destination of destinations) {
//           const cityName = typeof destination === 'string' ? destination : destination.cityName;
//           const url = `${API_URL}/api/cities/${encodeURIComponent(cityName)}/hotels`;

//           const response = await fetch(url);
//           if (!response.ok) {
//             throw new Error(`Failed to fetch hotels for ${cityName}`);
//           }

//           const data = await response.json();
//           newHotelsByCity[cityName] = Array.isArray(data.hotels) ? data.hotels : data;
//         }

//         setHotelsByCity(newHotelsByCity);
//         if (!dialogSelectedCity && Object.keys(newHotelsByCity).length > 0) {
//           setDialogSelectedCity(Object.keys(newHotelsByCity)[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching hotels:', error);
//         setError(`Failed to fetch hotels: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotelsForAllCities();
//   }, [formData.clientInfo.destinationAreas, API_URL]);

//   const handleHotelSelect = (hotel) => {
//     const newSelectedHotels = [...selectedHotels, hotel];
//     setSelectedHotels(newSelectedHotels);
//     handleChange('hotelInfo', 'hotels', newSelectedHotels);
//     setIsDialogOpen(false);
//   };

//   const handleCustomHotelAdd = () => {
//     if (customHotelInput.trim()) {
//       const newCustomHotel = {
//         id: `custom-${Date.now()}`,
//         name: customHotelInput.trim(),
//         description: customHotelDescription.trim(),
//         isCustom: true,
//       };

//       setCustomHotels((prev) => [...prev, newCustomHotel]);
//       handleHotelSelect(newCustomHotel);
//       setCustomHotelInput('');
//       setCustomHotelDescription('');
//     }
//   };

//   const handleRemoveHotel = (indexToRemove) => {
//     const newSelectedHotels = selectedHotels.filter((_, index) => index !== indexToRemove);
//     setSelectedHotels(newSelectedHotels);
//     handleChange('hotelInfo', 'hotels', newSelectedHotels);
//   };

//   return (
//     <Card sx={{ mb: 2 }}>
//       <CardContent>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6">Hotel Information</Typography>
//           <Button
//             startIcon={<Add />}
//             variant="contained"
//             onClick={() => setIsDialogOpen(true)}
//           >
//             Add Hotel
//           </Button>
//         </Box>

//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {loading && (
//           <Box sx={{ mt: 2, textAlign: 'center' }}>
//             <CircularProgress size={24} />
//             <Typography sx={{ mt: 1 }}>Loading hotels...</Typography>
//           </Box>
//         )}

//         <Box sx={{ mt: 2 }}>
//           {selectedHotels.map((hotel, index) => (
//             <Card variant="outlined" sx={{ mb: 2 }} key={index}>
//               <CardContent>
//                 <Typography variant="h6">{hotel.name}</Typography>
//                 {hotel.description && (
//                   <Typography variant="body2" color="text.secondary">
//                     {hotel.description}
//                   </Typography>
//                 )}
//                 {hotel.isCustom && (
//                   <Typography variant="caption" color="text.secondary">
//                     (Custom Entry)
//                   </Typography>
//                 )}
//                 <IconButton
//                   color="error"
//                   onClick={() => handleRemoveHotel(index)}
//                   sx={{ float: 'right' }}
//                 >
//                   <Delete />
//                 </IconButton>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>

//         <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
//           <DialogTitle>Add a Hotel</DialogTitle>
//           <DialogContent>
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle1">Select from Available Hotels</Typography>
//               {hotelsByCity[dialogSelectedCity]?.map((hotel) => (
//                 <Box key={hotel._id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
//                   <Typography>{hotel.name}</Typography>
//                   <Button onClick={() => handleHotelSelect(hotel)} variant="outlined">
//                     Add
//                   </Button>
//                 </Box>
//               ))}
//             </Box>
//             <Box>
//               <Typography variant="subtitle1">Or Add Custom Hotel</Typography>
//               <TextField
//                 fullWidth
//                 placeholder="Enter custom hotel name"
//                 value={customHotelInput}
//                 onChange={(e) => setCustomHotelInput(e.target.value)}
//                 sx={{ mt: 2 }}
//               />
//               <TextField
//                 fullWidth
//                 placeholder="Enter description"
//                 value={customHotelDescription}
//                 onChange={(e) => setCustomHotelDescription(e.target.value)}
//                 sx={{ mt: 2 }}
//               />
//               <Button
//                 onClick={handleCustomHotelAdd}
//                 variant="contained"
//                 sx={{ mt: 1 }}
//                 disabled={!customHotelInput.trim()}
//               >
//                 Add Custom Hotel
//               </Button>
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
//           </DialogActions>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };

// export default HotelInfo;




import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const HotelInfo = ({ formData, handleChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hotelsByCity, setHotelsByCity] = useState({});
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogSelectedCity, setDialogSelectedCity] = useState('');
  const [customHotels, setCustomHotels] = useState([]);
  const [customHotelInput, setCustomHotelInput] = useState('');
  const [customHotelDescription, setCustomHotelDescription] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHotelsForAllCities = async () => {
      const destinations = formData.clientInfo.destinationAreas;
      if (!destinations || destinations.length === 0) return;

      setLoading(true);
      setError(null);
      const newHotelsByCity = {};

      try {
        for (const destination of destinations) {
          const cityName = typeof destination === 'string' ? destination : destination.cityName;
          const url = `${API_URL}/api/cities/${encodeURIComponent(cityName)}/hotels`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch hotels for ${cityName}`);
          }

          const data = await response.json();
          newHotelsByCity[cityName] = Array.isArray(data.hotels) ? data.hotels : data;
        }

        setHotelsByCity(newHotelsByCity);
        if (!dialogSelectedCity && Object.keys(newHotelsByCity).length > 0) {
          setDialogSelectedCity(Object.keys(newHotelsByCity)[0]);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setError(`Failed to fetch hotels: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsForAllCities();
  }, [formData.clientInfo.destinationAreas, API_URL]);

  const handleHotelSelect = (hotel) => {
    const newSelectedHotels = [...selectedHotels, hotel];
    setSelectedHotels(newSelectedHotels);
    handleChange('hotelInfo', 'hotels', newSelectedHotels);
    setIsDialogOpen(false);
  };

  const handleCustomHotelAdd = () => {
    if (customHotelInput.trim()) {
      const newCustomHotel = {
        id: `custom-${Date.now()}`,
        name: customHotelInput.trim(),
        description: customHotelDescription.trim(),
        isCustom: true,
      };

      setCustomHotels((prev) => [...prev, newCustomHotel]);
      handleHotelSelect(newCustomHotel);
      setCustomHotelInput('');
      setCustomHotelDescription('');
    }
  };

  const handleRemoveHotel = (indexToRemove) => {
    const newSelectedHotels = selectedHotels.filter((_, index) => index !== indexToRemove);
    setSelectedHotels(newSelectedHotels);
    handleChange('hotelInfo', 'hotels', newSelectedHotels);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Hotel Information</Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => setIsDialogOpen(true)}
          >
            Add Hotel
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress size={24} />
            <Typography sx={{ mt: 1 }}>Loading hotels...</Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          {selectedHotels.map((hotel, index) => (
            <Card variant="outlined" sx={{ mb: 2 }} key={index}>
              <Box sx={{ display: 'flex' }}>
                {hotel.image && (
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: 'cover' }}
                    image={hotel.image}
                    alt={hotel.name}
                  />
                )}
                <CardContent sx={{ flex: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <div>
                      <Typography variant="h6">{hotel.name}</Typography>
                      {hotel.price && (
                        <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                          Rs. {hotel.price}
                        </Typography>
                      )}
                      {hotel.description && (
                        <Typography variant="body2" color="text.secondary">
                          {hotel.description}
                        </Typography>
                      )}
                      {hotel.isCustom && (
                        <Typography variant="caption" color="text.secondary">
                          (Custom Entry)
                        </Typography>
                      )}
                    </div>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveHotel(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Box>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
          <DialogTitle>Add a Hotel</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Select from Available Hotels</Typography>
              {hotelsByCity[dialogSelectedCity]?.map((hotel) => (
                <Box key={hotel._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {hotel.image && (
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <Typography>{hotel.name}</Typography>
                      {hotel.price && (
                        <Typography variant="caption" color="primary">
                          Rs. {hotel.price}
                        </Typography>
                      )}
                    </div>
                  </Box>
                  <Button onClick={() => handleHotelSelect(hotel)} variant="outlined">
                    Add
                  </Button>
                </Box>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1">Or Add Custom Hotel</Typography>
              <TextField
                fullWidth
                placeholder="Enter custom hotel name"
                value={customHotelInput}
                onChange={(e) => setCustomHotelInput(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                placeholder="Enter description"
                value={customHotelDescription}
                onChange={(e) => setCustomHotelDescription(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Button
                onClick={handleCustomHotelAdd}
                variant="contained"
                sx={{ mt: 1 }}
                disabled={!customHotelInput.trim()}
              >
                Add Custom Hotel
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default HotelInfo;