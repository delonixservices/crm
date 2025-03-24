import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HotelForm from './HotelForm';
import ActivityForm from './ActivityForm';

const EditCity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cityData, setCityData] = useState({
    countryName: '',
    cityName: '',
    activities: [],
    hotels: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cities/${id}`);
        if (!response.ok) throw new Error('Failed to fetch city details');
        const data = await response.json();
        
        // Initialize empty arrays if they don't exist
        const formattedData = {
          ...data,
          activities: data.activities.map(activity => ({
            ...activity,
            slots: activity.slots || [{ startTime: '', endTime: '' }],
            selectedCategories: activity.selectedCategories || []
          })),
          hotels: data.hotels.map(hotel => ({
            ...hotel,
            selectedAmenities: hotel.selectedAmenities || []
          }))
        };
        
        setCityData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/cities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityData),
      });

      if (!response.ok) throw new Error('Failed to update city');
      navigate(`/city/${id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleActivityChange = (index, field, value) => {
    const newActivities = [...cityData.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setCityData({ ...cityData, activities: newActivities });
  };

  const handleHotelChange = (index, field, value) => {
    const newHotels = [...cityData.hotels];
    newHotels[index] = { ...newHotels[index], [field]: value };
    setCityData({ ...cityData, hotels: newHotels });
  };

  const handleAmenityChange = (hotelIndex, amenity) => {
    const newHotels = [...cityData.hotels];
    const hotel = newHotels[hotelIndex];
    const selectedAmenities = hotel.selectedAmenities || [];
    
    if (selectedAmenities.includes(amenity)) {
      hotel.selectedAmenities = selectedAmenities.filter(a => a !== amenity);
    } else {
      hotel.selectedAmenities = [...selectedAmenities, amenity];
    }
    
    setCityData({ ...cityData, hotels: newHotels });
  };

  const handleSlotChange = (activityIndex, slotIndex, field, value) => {
    const newActivities = [...cityData.activities];
    const activity = newActivities[activityIndex];
    activity.slots = activity.slots || [];
    activity.slots[slotIndex] = {
      ...activity.slots[slotIndex],
      [field]: value
    };
    setCityData({ ...cityData, activities: newActivities });
  };

  const handleAddSlot = (activityIndex) => {
    const newActivities = [...cityData.activities];
    const activity = newActivities[activityIndex];
    activity.slots = [...(activity.slots || []), { startTime: '', endTime: '' }];
    setCityData({ ...cityData, activities: newActivities });
  };

  const handleCategoryChange = (activityIndex, category) => {
    const newActivities = [...cityData.activities];
    const activity = newActivities[activityIndex];
    const selectedCategories = activity.selectedCategories || [];
    
    if (selectedCategories.includes(category)) {
      activity.selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      activity.selectedCategories = [...selectedCategories, category];
    }
    
    setCityData({ ...cityData, activities: newActivities });
  };

  const addActivity = () => {
    setCityData({
      ...cityData,
      activities: [...cityData.activities, {
        name: '',
        description: '',
        image: '',
        price: '',
        duration: '',
        slots: [{ startTime: '', endTime: '' }],
        selectedCategories: []
      }]
    });
  };

  const addHotel = () => {
    setCityData({
      ...cityData,
      hotels: [...cityData.hotels, {
        name: '',
        description: '',
        image: '',
        price: '',
        starRating: '3',
        propertyType: '',
        mealPlan: '',
        selectedAmenities: []
      }]
    });
  };

  const removeActivity = (index) => {
    setCityData({
      ...cityData,
      activities: cityData.activities.filter((_, i) => i !== index)
    });
  };

  const removeHotel = (index) => {
    setCityData({
      ...cityData,
      hotels: cityData.hotels.filter((_, i) => i !== index)
    });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Edit City</h1>
      <form onSubmit={handleSubmit} className="space-y-8">

      <div className="mb-6">
          <label className="block mb-2 font-medium">Country Name</label>
          <input
            type="text"
            value={cityData.countryName}
            onChange={(e) => setCityData({ ...cityData, countryName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">City Name</label>
          <input
            type="text"
            value={cityData.cityName}
            onChange={(e) => setCityData({ ...cityData, cityName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Hotels</h2>
            <button
              type="button"
              onClick={addHotel}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Hotel
            </button>
          </div>
          {cityData.hotels.map((hotel, index) => (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => removeHotel(index)}
                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
              >
                Remove Hotel
              </button>
              <HotelForm
                hotel={hotel}
                index={index}
                onHotelChange={handleHotelChange}
                onAmenityChange={handleAmenityChange}
              />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Activities</h2>
            <button
              type="button"
              onClick={addActivity}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Activity
            </button>
          </div>
          {cityData.activities.map((activity, index) => (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => removeActivity(index)}
                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
              >
                Remove Activity
              </button>
              <ActivityForm
                activity={activity}
                activityIndex={index}
                onActivityChange={handleActivityChange}
                onSlotChange={handleSlotChange}
                onAddSlot={handleAddSlot}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <Link
            to={`/city/${id}`}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditCity;