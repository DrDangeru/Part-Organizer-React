import React, { useState, useEffect } from 'react';
import { usePartsApi, Part, Location } from '../../src/api/partsApi';
import useAlert from '../hooks/useAlert';

const PartsForm = () => {
  const [partName, setPartName] = useState('');
  const [partDetails, setPartDetails] = useState('');
  const [locationName, setLocationName] = useState('');
  const [container, setContainer] = useState('');
  const [row, setRow] = useState('');
  const [position, setPosition] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const { alertMessage, setAlertMessage } = useAlert(6000);
  const api = usePartsApi();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setAlertMessage('Failed to fetch locations');
      }
    };

    const fetchParts = async () => {
      try {
        const data = await api.getParts();
        setParts(data);
      } catch (error) {
        console.error('Error fetching parts:', error);
        setAlertMessage('Failed to fetch parts');
      }
    };

    fetchLocations();
    fetchParts();
  }, [api, setAlertMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partName || !locationName || !container || !row || !position) {
      setAlertMessage(
        'Please fill in all required fields (including location)'
      );
      return;
    }

    try {
      const newPart: Part = {
        partName,
        partDetails,
        locationName,
        container,
        row,
        position,
      };

      await api.addPart(newPart);
      await api.getParts().then(data => setParts(data));
      setAlertMessage('Part added successfully!');

      // Reset form
      setPartName('');
      setPartDetails('');
      setLocationName('');
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
      <form
        role="form"
        onSubmit={handleSubmit}
        className="space-y-4 max-w-lg mx-auto"
      >
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
            htmlFor="locationName"
            className="block text-gray-700 text-sm mb-2"
          >
            Location*
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center ${!locationName && 'border-red-500'}`}
            id="locationName"
            value={locationName}
            onChange={e => {
              setLocationName(e.target.value);
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
          {locationName && (
            <p className="text-sm text-gray-600 mt-1">
              Suggested container from location:{' '}
              {
                locations.find(loc => loc.locationName === locationName)
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
        <h3 className="text-xl font-bold mb-4">Parts List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Part Name
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Details
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Location
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Container
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Row
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Position
                </th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {part.partName}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {part.partDetails}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {part.locationName}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {part.container}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {part.row}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {part.position}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Locations List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Location Name
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Container
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Row
                </th>
                <th className="py-8 px-12 border !border-gray-300 !border-solid">
                  Position
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {location.locationName}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {location.container}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {location.row}
                  </td>
                  <td className="py-4 px-12 border !border-gray-300 !border-solid">
                    {location.position}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartsForm;
