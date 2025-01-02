import React, { useState, useEffect, useCallback } from 'react';
import { partsApi, Part, Location } from '../../src/api/partsApi';
import useAlert from '../hooks/useAlert';

const PartsForm = () => {
  const [partName, setPartName] = useState<string>('');
  const [partDetails, setPartDetails] = useState<string>('');
  const [locationId, setLocationId] = useState<string>('');
  const [container, setContainer] = useState<string>('');
  const [row, setRow] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [parts, setParts] = useState<Part[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { alertMessage, setAlertMessage } = useAlert(6000); // 6 seconds

  const loadParts = useCallback(async () => {
    try {
      const allParts = await partsApi.getParts();
      setParts(allParts);
    } catch (error) {
      console.error('Error loading parts:', error);
      setAlertMessage('Failed to load parts');
    }
  }, [setAlertMessage]);

  const loadLocations = useCallback(async () => {
    try {
      const allLocations = await partsApi.getLocations();
      setLocations(allLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      setAlertMessage('Failed to load locations');
    }
  }, [setAlertMessage]);

  useEffect(() => {
    loadParts();
    loadLocations();
  }, [loadParts, loadLocations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partName || !locationId || !container || !row || !position) {
      setAlertMessage(
        'Please fill in all required fields (including location)'
      );
      return;
    }

    try {
      const newPart: Part = {
        partName,
        partDetails,
        locationName: locationId,
        container,
        row,
        position,
      };

      console.log('Submitting part:', newPart);
      await partsApi.addPart(newPart);
      await loadParts();
      setAlertMessage('Part added successfully!');

      // Reset form
      setPartName('');
      setPartDetails('');
      setLocationId('');
      setContainer('');
      setRow('');
      setPosition('');
    } catch (error) {
      console.error('Error adding part:', error);
      setAlertMessage(
        error instanceof Error
          ? error.message
          : 'Failed to add part. Please try again.'
      );
    }
  };

  const getLocationDetails = (locationName: string) => {
    const location = locations.find(loc => loc.locationName === locationName);
    if (location) {
      // Only suggest the container, don't force it
      setContainer(location.container);
      setRow(location.row);
      setPosition(location.position);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Part</h2>
      <form role="form" onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div className="part-form text-center">
          <label
            htmlFor="partName"
            className="block text-gray-700 text-sm mb-2"
          >
            Part Name*
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            id="partName"
            value={partName}
            onChange={e => setPartName(e.target.value)}
            required
          />
        </div>

        <div className="part-form text-center">
          <label
            htmlFor="partDetails"
            className="block text-gray-700 text-sm mb-2"
          >
            Part Details
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            id="partDetails"
            value={partDetails}
            onChange={e => setPartDetails(e.target.value)}
          />
        </div>

        <div className="part-form text-center">
          <label
            htmlFor="locationId"
            className="block text-gray-700 text-sm mb-2"
          >
            Location*
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center ${!locationId && 'border-red-500'}`}
            id="locationId"
            value={locationId}
            onChange={e => {
              setLocationId(e.target.value);
              getLocationDetails(e.target.value);
            }}
            required
          >
            <option value="">Select a location</option>
            {locations.map(location => (
              <option key={location.locationName} value={location.locationName}>
                {location.locationName}
              </option>
            ))}
          </select>
        </div>

        <div className="part-form text-center">
          <label
            htmlFor="container"
            className="block text-gray-700 text-sm mb-2"
          >
            Container*
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            id="container"
            value={container}
            onChange={e => setContainer(e.target.value)}
            placeholder="Enter container name"
            required
          />
          {locationId && (
            <p className="text-sm text-gray-600 mt-1">
              Suggested container from location:{' '}
              {
                locations.find(loc => loc.locationName === locationId)
                  ?.container
              }
            </p>
          )}
        </div>

        <div className="part-form text-center">
          <label htmlFor="row" className="block text-gray-700 text-sm mb-2">
            Row*
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            id="row"
            value={row}
            onChange={e => setRow(e.target.value)}
            required
          />
        </div>

        <div className="part-form text-center">
          <label
            htmlFor="position"
            className="block text-gray-700 text-sm mb-2"
          >
            Position*
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            id="position"
            value={position}
            onChange={e => setPosition(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Part
          </button>
        </div>
      </form>

      {alertMessage && (
        <div 
          data-testid="alert-message"
          className="mt-4 p-4 bg-red-100 text-red-700 font-bold rounded text-center max-w-lg mx-auto"
          role="alert"
        >
          {alertMessage}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center">Parts List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts.map(part => (
            <div
              key={part.id}
              className="bg-white shadow rounded p-4 text-center"
            >
              <h4 className="font-bold">{part.partName}</h4>
              {part.partDetails && <p>Details: {part.partDetails}</p>}
              <p>Location: {part.locationName}</p>
              <p>Container: {part.container}</p>
              <p>Row: {part.row}</p>
              <p>Position: {part.position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartsForm;
