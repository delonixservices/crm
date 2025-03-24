import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CityDetail = () => {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use Vite's environment variable
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/cities/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCity(data);
        } else {
          throw new Error('Failed to fetch city details');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [id, apiUrl]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!city) return <div>City not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{city.cityName}</h1>
          <p className="text-gray-600 text-lg">{city.countryName}</p>
        </div>
        <Link
          to={`/edit-city/${city._id}`}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit City
        </Link>
      </div>

      {/* Activities Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {city.activities.map((activity, index) => (
            <div key={index} className="border rounded-lg shadow-md overflow-hidden">
              <img
                src={activity.image}
                alt={activity.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
                <p className="text-gray-600 mb-3">{activity.description}</p>
                <div className="mb-3">
                  <p className="font-medium">Duration: {activity.duration} hours</p>
                  <p className="text-green-600 font-semibold">₹{activity.price}</p>
                </div>

                {/* Time Slots */}
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Available Time Slots:</h4>
                  <div className="space-y-1">
                    {activity.slots.map((slot, slotIndex) => (
                      <p key={slotIndex} className="text-sm text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                {activity.selectedCategories?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activity.selectedCategories.map((category, catIndex) => (
                      <span
                        key={catIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hotels Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {city.hotels.map((hotel, index) => (
            <div key={index} className="border rounded-lg shadow-md overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <p className="text-gray-600 mb-3">{hotel.description}</p>
                
                <div className="mb-3 space-y-1">
                  <div className="flex items-center">
                    <span className="text-yellow-400">
                      {'★'.repeat(hotel.starRating)}
                    </span>
                    <span className="text-gray-400 ml-1">
                      {'★'.repeat(7 - hotel.starRating)}
                    </span>
                  </div>
                  <p className="font-medium">{hotel.propertyType}</p>
                  <p className="text-gray-600">{hotel.mealPlan}</p>
                  <p className="text-green-600 font-semibold">₹{hotel.price} per night</p>
                </div>

                {/* Amenities */}
                {hotel.selectedAmenities?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.selectedAmenities.map((amenity, amenityIndex) => (
                        <span
                          key={amenityIndex}
                          className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link
        to="/cities"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Cities
      </Link>
    </div>
  );
};

export default CityDetail;
