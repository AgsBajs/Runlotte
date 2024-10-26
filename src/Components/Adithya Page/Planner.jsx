import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

if (import.meta.env.VITE_MAPBOX_TOKEN) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
} else {
  console.error('Mapbox token not found in environment variables');
}

const RoutePlanner = ({ userLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetDistance, setTargetDistance] = useState(2);
  const [actualDistance, setActualDistance] = useState(0);
  const [oneWayDistance, setOneWayDistance] = useState(0);
  const [startingPoint, setStartingPoint] = useState(null);
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedParkingLot, setSelectedParkingLot] = useState(null);

  const milesToKm = (miles) => miles * 1.60934;
  const kmToMiles = (km) => km / 1.60934;

  // Find nearby parking lots
  const findNearbyParkingLots = async () => {
    try {
      setLoading(true);
      
      // Search for parking lots within 5 mile radius
      const radiusInMeters = milesToKm(5) * 1000;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/parking.json?` +
        `proximity=${userLocation[0]},${userLocation[1]}&` +
        `radius=${radiusInMeters}&` +
        `types=poi&` +
        `access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch parking lots');
      }

      const data = await response.json();
      const lots = data.features
        .filter(feature => 
          feature.properties.category?.includes('parking') || 
          feature.properties.maki === 'parking'
        )
        .map(lot => ({
          id: lot.id,
          name: lot.text,
          coordinates: lot.center,
          distance: kmToMiles(lot.properties.distance / 1000)
        }))
        .sort((a, b) => a.distance - b.distance);

      setParkingLots(lots);
      
      // Select the closest parking lot by default
      if (lots.length > 0) {
        setSelectedParkingLot(lots[0]);
        setStartingPoint(lots[0].coordinates);
      } else {
        throw new Error('No parking lots found within 5 miles');
      }

    } catch (error) {
      console.error('Error finding parking lots:', error);
      setError(`Failed to find parking lots: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create a destination point in a random direction from the parking lot
  const createDestinationPoint = (start, distanceMiles) => {
    const distanceKm = milesToKm(distanceMiles);
    const angle = Math.random() * 2 * Math.PI;
    const dx = distanceKm * Math.cos(angle);
    const dy = distanceKm * Math.sin(angle);
    const longitude = start[0] + (dx / (111.32 * Math.cos(start[1] * Math.PI / 180)));
    const latitude = start[1] + (dy / 111.32);
    return [longitude, latitude];
  };

  const generateRoute = async () => {
    try {
      if (!startingPoint) {
        throw new Error('No starting point selected');
      }

      setLoading(true);
      setError(null);

      const halfDistance = targetDistance / 2;
      const destination = createDestinationPoint(startingPoint, halfDistance);

      const coordinates = `${startingPoint.join(',')};${destination.join(',')}`;
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data = await response.json();
      
      if (!data.routes || !data.routes[0]) {
        throw new Error('No route found');
      }

      const routeGeometry = data.routes[0].geometry;
      const distanceKm = data.routes[0].distance / 1000;
      const distanceMiles = kmToMiles(distanceKm);
      setOneWayDistance(distanceMiles);
      setActualDistance(distanceMiles * 2);

      // Update map with new route
      if (map.current.getSource('route')) {
        map.current.removeLayer('route-return');
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: routeGeometry
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

      map.current.addLayer({
        id: 'route-return',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff4b4b',
          'line-width': 5,
          'line-opacity': 0.75,
          'line-dasharray': [2, 2]
        }
      });

      // Update markers
      if (map.current.getLayer('parking-lots')) {
        map.current.removeLayer('parking-lots');
        map.current.removeSource('parking-lots');
      }

      // Add destination marker
      new mapboxgl.Marker({ color: '#ff4b4b' })
        .setLngLat(destination)
        .setPopup(new mapboxgl.Popup().setHTML('Turnaround Point'))
        .addTo(map.current);

      // Fit the map to show both points
      const bounds = routeGeometry.coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(routeGeometry.coordinates[0], routeGeometry.coordinates[0]));

      map.current.fitBounds(bounds, {
        padding: 50
      });

    } catch (error) {
      console.error('Error generating route:', error);
      setError(`Failed to generate route: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLocation) {
      setError('No user location provided');
      setLoading(false);
      return;
    }

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation,
        zoom: 14,
      });

      map.current.on('load', async () => {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        await findNearbyParkingLots();
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
      setLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (selectedParkingLot && map.current) {
      // Clear existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].remove();
      }

      // Add marker for selected parking lot
      new mapboxgl.Marker({ color: '#3887be' })
        .setLngLat(selectedParkingLot.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <strong>Start/End Point</strong><br>
          ${selectedParkingLot.name}<br>
          ${selectedParkingLot.distance.toFixed(2)} miles from you
        `))
        .addTo(map.current);

      generateRoute();
    }
  }, [selectedParkingLot]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ minHeight: '500px' }}
      />
      
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 bg-gray-800 p-4 rounded-lg shadow-lg z-10">
        <div className="space-y-4">
          {/* Parking Lot Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Starting Point
            </label>
            <select
              value={selectedParkingLot?.id || ''}
              onChange={(e) => {
                const lot = parkingLots.find(l => l.id === e.target.value);
                setSelectedParkingLot(lot);
                setStartingPoint(lot.coordinates);
              }}
              className="w-full p-2 bg-gray-700 text-gray-200 rounded"
            >
              {parkingLots.map(lot => (
                <option key={lot.id} value={lot.id}>
                  {lot.name} ({lot.distance.toFixed(2)} mi)
                </option>
              ))}
            </select>
          </div>

          {/* Distance Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Total Distance: {targetDistance} miles
            </label>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={targetDistance}
              onChange={(e) => {
                setTargetDistance(parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Distance Info */}
          {oneWayDistance > 0 && (
            <div className="text-sm text-gray-300">
              <div>Outbound: {oneWayDistance.toFixed(2)} miles</div>
              <div>Return: {oneWayDistance.toFixed(2)} miles</div>
              <div className="font-medium">Total: {actualDistance.toFixed(2)} miles</div>
            </div>
          )}

          <button
            onClick={generateRoute}
            disabled={loading || !selectedParkingLot}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-600"
          >
            {loading ? 'Generating...' : 'Generate New Route'}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800 p-4 rounded-lg shadow-lg z-10">
        <div className="text-sm font-medium text-gray-200 mb-2">Route Legend</div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <div className="text-sm text-gray-300">Outbound</div>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-4 h-0.5 border-t-2 border-red-400 border-dashed"></div>
          <div className="text-sm text-gray-300">Return (Same Path)</div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            <div className="mt-2 text-gray-200">Generating route...</div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-900 text-red-100 p-4 rounded-lg shadow-lg z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;