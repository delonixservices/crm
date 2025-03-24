import React from 'react';

const categories = [
  'Adventure', 'Aquarium', 'Archaeology',
  'Art and Culture', 'Big Kids', 'City Tours', 'Couples', 'Entertainment',
  'Family', 'History', 'Hop on Hop off', 'Infant Friendly', 'Kids',
  'Museums', 'Must See', 'Shopping', 'Sports and Outdoor', 'Theme Parks',
  'Walking', 'Wildlife'
];

const ActivityForm = ({ activity, activityIndex, onActivityChange, onSlotChange, onAddSlot, onCategoryChange }) => {
  return (
    <div className="mb-6 p-4 border rounded bg-white text-black">
      {/* Activity Name Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Activity Name</label>
        <input
          type="text"
          placeholder="Enter activity name"
          value={activity.name}
          onChange={(e) => onActivityChange(activityIndex, 'name', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Activity Description Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Activity Description</label>
        <textarea
          placeholder="Enter activity description"
          value={activity.description}
          onChange={(e) => onActivityChange(activityIndex, 'description', e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <input
        type="url"
        placeholder="Image URL"
        value={activity.image}
        onChange={(e) => onActivityChange(activityIndex, 'image', e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={activity.price}
        onChange={(e) => onActivityChange(activityIndex, 'price', e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      {/* Duration Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Duration (in hours)</label>
        <input
          type="number"
          placeholder="Duration"
          value={activity.duration}
          onChange={(e) => onActivityChange(activityIndex, 'duration', e.target.value)}
          className="w-full p-2 border rounded"
          required
          min="0"
          step="0.5"
        />
      </div>

      {/* Slot Timing Fields */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Time Slots</label>
        {activity.slots.map((slot, slotIndex) => (
          <div key={slotIndex} className="flex gap-2 mb-2">
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => onSlotChange(activityIndex, slotIndex, 'startTime', e.target.value)}
              className="p-2 border rounded"
              required
            />
            <span className="flex items-center">to</span>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => onSlotChange(activityIndex, slotIndex, 'endTime', e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onAddSlot(activityIndex)}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Add Time Slot
        </button>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Categories</label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={activity.selectedCategories?.includes(category) || false}
                onChange={() => onCategoryChange(activityIndex, category)}
                className="rounded"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Selected Categories Display */}
      {activity.selectedCategories?.length > 0 && (
        <div className="mt-2">
          <label className="block text-sm font-medium mb-2">Selected Categories:</label>
          <div className="flex flex-wrap gap-2">
            {activity.selectedCategories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityForm;