import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Location, usePartsApi } from '../api/partsApi';
import useAlert from '../hooks/useAlert';

const LocationsList = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { alertMessage, setAlertMessage } = useAlert(6000); // 6 seconds
  const [searchQuery, setSearchQuery] = useState<string>('');
  const api = usePartsApi();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.getLocations();
        setLocations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to fetch locations');
        setAlertMessage(`Failed to fetch locations ${error}`);
      } finally {
       console.log('Locations fetched');
        // setLoading(false); not in use, maybe add later..
      }
    };
    fetchLocations();
  }, [api, setAlertMessage, error]);

  const filteredLocations = locations.filter(
    location =>
      location.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.container.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.row.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Locations</h2>
        <Link
          to="/add-location"
          className="!bg-blue-500 hover:!bg-blue-700 !text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block no-underline"
        >
          Add New Location
        </Link>
      </div>

      {alertMessage && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 font-bold rounded text-center max-w-lg mx-auto mb-6">
          {alertMessage}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search locations..."
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-red-500 focus:border-blue-500"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

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
            {filteredLocations.map((location, index) => (
              <tr
                key={location.id}
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
  );
};

export default LocationsList;
