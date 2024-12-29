import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Part, partsApi } from '../api/partsApi';

const PartsList = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const allParts = await partsApi.getParts();
      setParts(allParts);
    } catch (error) {
      console.error('Error loading parts:', error);
      setAlertMessage('Failed to load parts');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Parts Inventory</h2>
        <Link
          to="/add-part"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add New Part
        </Link>
      </div>

      {alertMessage && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded text-center max-w-lg mx-auto mb-6">
          {alertMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map(part => (
          <div key={part.id} className="bg-white shadow rounded p-4">
            <h4 className="font-bold text-lg mb-2">{part.partName}</h4>
            {part.partDetails && (
              <p className="text-gray-600 mb-2">Details: {part.partDetails}</p>
            )}
            <div className="text-gray-600">
              <p>Location: {part.locationName}</p>
              <p>Container: {part.container}</p>
              <p>Row: {part.row}</p>
              <p>Position: {part.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsList;
