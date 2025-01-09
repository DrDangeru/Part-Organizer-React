import React, { useState, useEffect, useCallback } from 'react';
import { usePartsApi, Location } from '../api/partsApi';
import useAlert from '../hooks/useAlert';

const LocationForm = () => {
  const [locationName, setLocationName] = useState<string>('');
  const [container, setContainer] = useState<string>('');
  const [row, setRow] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const { alertMessage, setAlertMessage } = useAlert(6000); // 6 seconds
  const [locations, setLocations] = useState<Location[]>([]);
  const api = usePartsApi();

  const loadLocations = useCallback(async () => {
    try {
      const allLocations = await api.getLocations();
      setLocations(allLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      setAlertMessage('Failed to load locations');
    }
  }, [api, setAlertMessage]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', { locationName, container, row, position });

    if (!locationName || !container || !row || !position) {
      console.log('Setting validation message');
      setAlertMessage('Please fill all required fields');
      return;
    }

    try {
      const newLocation: Location = {
        locationName,
        container,
        row,
        position,
      };

      console.log('Submitting location:', newLocation);
      await api.addLocation(newLocation);
      await loadLocations();
      setAlertMessage('Location added successfully!');

      // Reset form
      setLocationName('');
      setContainer('');
      setRow('');
      setPosition('');
    } catch (error) {
      console.error('Error adding location:', error);
      setAlertMessage(
        error instanceof Error
          ? error.message
          : 'Failed to add location. Please try again.'
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Location</h2>
      {alertMessage && (
        <div
          data-testid="alert-message"
          className="mt-4 p-4 bg-red-100 text-red-700 font-bold rounded text-center max-w-lg mx-auto"
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      <form
        role="form"
        onSubmit={handleSubmit}
        className="space-y-4 max-w-lg mx-auto"
      >
        <div className="location-form text-center">
          <label
            htmlFor="locationName"
            className="block text-gray-700 text-sm mb-2"
          >
            Location Name*
          </label>
          <input
            type="text"
            className={`
              shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight focus:outline-none 
              focus:shadow-outline text-center
            `}
            id="locationName"
            value={locationName}
            onChange={e => setLocationName(e.target.value)}
            required
          />
        </div>

        <div className="location-form text-center">
          <label
            htmlFor="container"
            className="block text-gray-700 text-sm mb-2"
          >
            Container*
          </label>
          <input
            type="text"
            className={`
              shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight focus:outline-none 
              focus:shadow-outline text-center
            `}
            id="container"
            value={container}
            onChange={e => setContainer(e.target.value)}
            required
          />
        </div>

        <div className="location-form text-center">
          <label htmlFor="row" className="block text-gray-700 text-sm mb-2">
            Row*
          </label>
          <input
            type="text"
            className={`
              shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight focus:outline-none 
              focus:shadow-outline text-center
            `}
            id="row"
            value={row}
            onChange={e => setRow(e.target.value)}
            required
          />
        </div>

        <div className="location-form text-center">
          <label
            htmlFor="position"
            className="block text-gray-700 text-sm mb-2"
          >
            Position*
          </label>
          <input
            type="text"
            className={`
              shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight focus:outline-none 
              focus:shadow-outline text-center
            `}
            id="position"
            value={position}
            onChange={e => setPosition(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="!bg-blue-500 hover:!bg-blue-700 !text-white
             font-bold py-2 px-4 rounded focus:outline-none 
             focus:shadow-outline"
          >
            Add Location
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center">Locations List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map(location => (
            <div
              key={location.id}
              className="bg-white shadow rounded p-4 text-center"
            >
              <h4 className="font-bold">{location.locationName}</h4>
              <p>Container: {location.container}</p>
              <p>Row: {location.row}</p>
              <p>Position: {location.position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
