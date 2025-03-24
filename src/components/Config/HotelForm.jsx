import React from 'react';

const propertyTypes = [
  'Hotel', 'Resort', 'Villa', 'Apartment', 'Guesthouse', 'Homestay'
];

const mealPlans = [
  'Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All Inclusive'
];

const amenities = [
  'Wi-Fi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service',
  'Bar', 'Parking', 'Airport Shuttle', 'Beach Access', 'Business Center',
  'Child Friendly', 'Pet Friendly'
];

const HotelForm = ({ hotel, index, onHotelChange, onAmenityChange }) => {
  return (
    <div className="mb-6 p-4 border rounded space-y-4">
      {/* Hotel Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Hotel Name</label>
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotel.name}
          onChange={(e) => onHotelChange(index, 'name', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Hotel Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          placeholder="Hotel Description"
          value={hotel.description}
          onChange={(e) => onHotelChange(index, 'description', e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      {/* Hotel Image */}
      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <input
          type="url"
          placeholder="Image URL"
          value={hotel.image}
          onChange={(e) => onHotelChange(index, 'image', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">Star Rating</label>
        <select
          value={hotel.starRating}
          onChange={(e) => onHotelChange(index, 'starRating', e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
            <option key={rating} value={rating}>
              {rating} Star{rating > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Property Type</label>
        <select
          value={hotel.propertyType}
          onChange={(e) => onHotelChange(index, 'propertyType', e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Property Type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Meal Plan */}
      <div>
        <label className="block text-sm font-medium mb-2">Meal Plan</label>
        <select
          value={hotel.mealPlan}
          onChange={(e) => onHotelChange(index, 'mealPlan', e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Meal Plan</option>
          {mealPlans.map((plan) => (
            <option key={plan} value={plan}>{plan}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">Price</label>
        <input
          type="number"
          placeholder="Price"
          value={hotel.price}
          onChange={(e) => onHotelChange(index, 'price', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium mb-2">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hotel.selectedAmenities?.includes(amenity) || false}
                onChange={() => onAmenityChange(index, amenity)}
                className="rounded"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Selected Amenities Display */}
      {hotel.selectedAmenities?.length > 0 && (
        <div className="mt-2">
          <label className="block text-sm font-medium mb-2">Selected Amenities:</label>
          <div className="flex flex-wrap gap-2">
            {hotel.selectedAmenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelForm;