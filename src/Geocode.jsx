// Function to geocode location string to coordinates using Mapbox Geocoding API
const geocodeLocation = async (locationString) => {
  console.log('Geocoding location:', locationString);

  if (!mapboxToken) {
    throw new Error('Mapbox token is not available');
  }

  try {
    const url = https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationString)}.json?access_token=${mapboxToken};
    console.log('Geocoding URL:', url);

    const response = await fetch(url);
    console.log('Geocoding response status:', response.status);

    if (!response.ok) {
      throw new Error(Geocoding failed: ${response.statusText});
    }

    const data = await response.json();
    console.log('Geocoding response:', data);

    if (!data.features || data.features.length === 0) {
      throw new Error('Location not found');
    }

    const [lng, lat] = data.features[0].center;
    console.log('Extracted coordinates:', { lng, lat });

    if (!validateCoordinates(lng, lat)) {
      throw new Error('Invalid coordinates returned from geocoding');
    }

    return [lng, lat];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Function to parse manual coordinate input
const parseCoordinates = (input) => {
  console.log('Parsing coordinates:', input);

  const parts = input.split(',').map(part => part.trim());

  if (parts.length !== 2) {
    throw new Error('Please enter coordinates in format: longitude,latitude');
  }

  const [lng, lat] = parts.map(part => {
    const num = parseFloat(part);
    if (isNaN(num)) {
      throw new Error('Coordinates must be numbers');
    }
    return num;
  });

  console.log('Parsed coordinates:', { lng, lat });

  if (!validateCoordinates(lng, lat)) {
    throw new Error('Coordinates out of valid range');
  }

  return [lng, lat];
}; 