import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Location, partsApi } from '../api/partsApi';

const LocationsList = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const allLocations = await partsApi.getLocations();
      setLocations(allLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      setAlertMessage('Failed to load locations');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Locations</h2>
        <Link
          to="/add-location"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add New Location
        </Link>
      </div>

      {alertMessage && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded text-center max-w-lg mx-auto mb-6">
          {alertMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map(location => (
          <div
            key={location.id}
            className="bg-white shadow rounded p-4 text-center"
          >
            <h4 className="font-bold text-lg mb-2">{location.locationName}</h4>
            <p className="text-gray-600">Container: {location.container}</p>
            <p className="text-gray-600">Row: {location.row}</p>
            <p className="text-gray-600">Position: {location.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsList;
