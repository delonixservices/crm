import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cities`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setCities(data);
      } catch (error) {
        setError(error.message || 'An unexpected error occurred');
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold mb-4">No Cities Found</h1>
        <p className="text-gray-700 mb-4">
          It seems like there are no cities added yet. Start by adding a new city.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New City
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-black bg-white">
      <h1 className="text-2xl font-bold mb-6">Cities List</h1>
      <div className="grid gap-4">
        {cities.map((city) => (
          <div
            key={city._id}
            className="flex justify-between items-center p-4 border rounded hover:bg-gray-50"
          >
            <Link to={`/config/city/${city._id}`} className="flex-grow">
              <h2 className="text-xl font-semibold">{city.cityName}</h2>
              <p className="text-gray-600">
                {city.countryName} • {city.activities.length} activities,{' '}
                {city.hotels.length} hotels
              </p>
            </Link>
            <Link
              to={`/config/edit-city/${city._id}`}
              className="ml-4 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
      <Link
        to="/"
        className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New City
      </Link>
    </div>
  );
};

export default CityList;
