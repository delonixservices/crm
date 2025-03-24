import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityForm from './ActivityForm';
import HotelForm from './HotelForm';

const CityForm = () => {
  const [formData, setFormData] = useState({
    countryName: '',
    cityName: '',
    activities: [{
      name: '',
      description: '',
      image: '',
      price: '',
      slots: [{ startTime: '', endTime: '' }],
      duration: '',
      selectedCategories: []
    }],
    hotels: [{
      name: '',
      image: '',
      price: '',
      description: '',
      starRating: '3',
      propertyType: '',
      mealPlan: '',
      selectedAmenities: []
    }]
  });

  const navigate = useNavigate();

  const handleActivityChange = (activityIndex, field, value) => {
    const newActivities = [...formData.activities];
    newActivities[activityIndex] = { ...newActivities[activityIndex], [field]: value };
    setFormData({ ...formData, activities: newActivities });
  };

  const handleSlotChange = (activityIndex, slotIndex, field, value) => {
    const newActivities = [...formData.activities];
    newActivities[activityIndex].slots[slotIndex] = {
      ...newActivities[activityIndex].slots[slotIndex],
      [field]: value
    };
    setFormData({ ...formData, activities: newActivities });
  };

  const addSlot = (activityIndex) => {
    const newActivities = [...formData.activities];
    newActivities[activityIndex].slots.push({ startTime: '', endTime: '' });
    setFormData({ ...formData, activities: newActivities });
  };

  const handleCategoryChange = (activityIndex, category) => {
    const newActivities = [...formData.activities];
    const currentCategories = newActivities[activityIndex].selectedCategories || [];
    
    if (currentCategories.includes(category)) {
      newActivities[activityIndex].selectedCategories = currentCategories.filter(c => c !== category);
    } else {
      newActivities[activityIndex].selectedCategories = [...currentCategories, category];
    }
    
    setFormData({ ...formData, activities: newActivities });
  };

  const handleHotelChange = (index, field, value) => {
    const newHotels = [...formData.hotels];
    newHotels[index] = { ...newHotels[index], [field]: value };
    setFormData({ ...formData, hotels: newHotels });
  };

  const handleAmenityChange = (hotelIndex, amenity) => {
    const newHotels = [...formData.hotels];
    const currentAmenities = newHotels[hotelIndex].selectedAmenities || [];
    
    if (currentAmenities.includes(amenity)) {
      newHotels[hotelIndex].selectedAmenities = currentAmenities.filter(a => a !== amenity);
    } else {
      newHotels[hotelIndex].selectedAmenities = [...currentAmenities, amenity];
    }
    
    setFormData({ ...formData, hotels: newHotels });
  };

  const addActivity = () => {
    setFormData({
      ...formData,
      activities: [...formData.activities, {
        name: '',
        description: '',
        image: '',
        price: '',
        slots: [{ startTime: '', endTime: '' }],
        duration: '',
        selectedCategories: []
      }]
    });
  };

  const addHotel = () => {
    setFormData({
      ...formData,
      hotels: [...formData.hotels, {
        name: '',
        image: '',
        price: '',
        description: '',
        starRating: '3',
        propertyType: '',
        mealPlan: '',
        selectedAmenities: []
      }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`'${API_URL}/api/cities'`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        navigate('/cities');
      } else {
        throw new Error('Failed to save city');
      }
    } catch (error) {
      console.error('Error saving city:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">Enter City Details</h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Enter Country Name</label>
            <input
              type="text"
              value={formData.countryName}
              onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>


          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Enter City Name</label>
            <input
              type="text"
              value={formData.cityName}
              onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Activities Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Activities</h2>
            {formData.activities.map((activity, index) => (
              <ActivityForm
                key={index}
                activity={activity}
                activityIndex={index}
                onActivityChange={handleActivityChange}
                onSlotChange={handleSlotChange}
                onAddSlot={addSlot}
                onCategoryChange={handleCategoryChange}
              />
            ))}
            <button
              type="button"
              onClick={addActivity}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Activity
            </button>
          </div>

          {/* Hotels Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Hotels</h2>
            {formData.hotels.map((hotel, index) => (
              <HotelForm
                key={index}
                hotel={hotel}
                index={index}
                onHotelChange={handleHotelChange}
                onAmenityChange={handleAmenityChange}
              />
            ))}
            <button
              type="button"
              onClick={addHotel}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Hotel
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CityForm;