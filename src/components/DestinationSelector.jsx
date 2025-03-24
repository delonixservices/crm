// import React, { useState, useEffect } from 'react';
// import { TextField, Autocomplete, CircularProgress } from '@mui/material';
// import { Alert } from '@mui/material';

// const API_URL = import.meta.env.VITE_API_URL || '';

// const DestinationSelector = ({ value, onChange }) => {
//   const [inputValue, setInputValue] = useState('');
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCities = async () => {
//       if (!inputValue.trim()) {
//         setOptions([]);
//         return;
//       }
//       setLoading(true);
//       setError(null);
//       try {
//         const url = `${API_URL}/api/cities/search?query=${encodeURIComponent(inputValue)}`;
//         console.log('Fetching from:', url);
        
//         const response = await fetch(url);
        
//         if (!response.ok) {
//           throw new Error(`Server error: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (Array.isArray(data)) {
//           setOptions(data.map(city => ({
//             id: city._id,
//             cityName: city.cityName,
//             // Include any other relevant city data here
//           })));
//         } else {
//           console.error('Received non-array data:', data);
//           setOptions([]);
//         }
//       } catch (err) {
//         console.error('Error fetching cities:', err);
//         setError(`Failed to fetch cities: ${err.message}`);
//         setOptions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const timeoutId = setTimeout(fetchCities, 300);
//     return () => clearTimeout(timeoutId);
//   }, [inputValue]);

//   return (
//     <div className="w-full">
//       {error && (
//         <Alert severity="error" className="mb-4">
//           {error}
//         </Alert>
//       )}
      
//       <Autocomplete
//         multiple
//         value={value || []}
//         options={options}
//         getOptionLabel={(option) => {
//           // Handle both string and object cases
//           if (typeof option === 'string') return option;
//           return option?.cityName || '';
//         }}
//         filterOptions={(x) => x}
//         loading={loading}
//         onInputChange={(event, newInputValue) => {
//           setInputValue(newInputValue);
//         }}
//         onChange={(event, newValue) => {
//           // Ensure we're passing the full city objects
//           onChange(newValue.map(item => ({
//             id: item.id,
//             cityName: item.cityName
//           })));
//         }}
//         isOptionEqualToValue={(option, value) => {
//           // Handle both ID and full object comparison
//           if (!option || !value) return false;
//           return option.id === value.id || option.cityName === value.cityName;
//         }}
//         renderOption={(props, option) => (
//           <li {...props} key={option.id}>
//             {option.cityName}
//           </li>
//         )}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select Destinations"
//             variant="outlined"
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <React.Fragment>
//                   {loading && <CircularProgress color="inherit" size={20} />}
//                   {params.InputProps.endAdornment}
//                 </React.Fragment>
//               ),
//             }}
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default DestinationSelector;



import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import { Alert } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || '';

const DestinationSelector = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customInputs, setCustomInputs] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!inputValue.trim()) {
        setOptions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}/api/cities/search?query=${encodeURIComponent(inputValue)}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setOptions(data.map(city => ({
            id: city._id,
            cityName: city.cityName,
          })));
        } else {
          console.error('Received non-array data:', data);
          setOptions([]);
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError(`Failed to fetch cities: ${err.message}`);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // Combine API options with custom inputs
  const allOptions = [...options, ...customInputs];

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue && !options.find(opt => opt.cityName.toLowerCase() === inputValue.toLowerCase())) {
      // Create a new custom input
      const newCustomInput = {
        id: `custom-${Date.now()}`,
        cityName: inputValue,
        isCustom: true
      };
      
      setCustomInputs(prev => [...prev, newCustomInput]);
      
      // Add the custom input to the selected values
      onChange([...value, newCustomInput]);
      
      // Clear the input
      setInputValue('');
    }
  };

  return (
    <div className="w-full">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Autocomplete
        multiple
        value={value || []}
        options={allOptions}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option?.cityName || '';
        }}
        filterOptions={(options, { inputValue }) => {
          const filtered = options.filter(option => 
            option.cityName.toLowerCase().includes(inputValue.toLowerCase())
          );
          
          // If there's input and no exact match, show option to add custom input
          if (inputValue !== '' && 
              !options.find(opt => opt.cityName.toLowerCase() === inputValue.toLowerCase())) {
            filtered.push({
              id: `custom-${Date.now()}`,
              cityName: `Add "${inputValue}"`,
              inputValue: inputValue,
              isCustom: true
            });
          }
          
          return filtered;
        }}
        loading={loading}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          // Handle selecting custom option
          const lastValue = newValue[newValue.length - 1];
          if (lastValue?.inputValue) {
            const customValue = {
              id: `custom-${Date.now()}`,
              cityName: lastValue.inputValue,
              isCustom: true
            };
            newValue[newValue.length - 1] = customValue;
            setCustomInputs(prev => [...prev, customValue]);
          }
          
          onChange(newValue);
        }}
        isOptionEqualToValue={(option, value) => {
          if (!option || !value) return false;
          return option.id === value.id || option.cityName === value.cityName;
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.inputValue ? `Add "${option.inputValue}"` : option.cityName}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Destinations"
            variant="outlined"
            onKeyDown={handleKeyDown}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default DestinationSelector;