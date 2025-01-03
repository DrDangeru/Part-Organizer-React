import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Part, partsApi } from '../api/partsApi';

const PartsList = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
  //Search with memo
  const filteredParts = useMemo(() => {
    if (!searchQuery) return parts;
    
    const lowerQuery = searchQuery.toLowerCase();
    return parts.filter(part => 
      part.partName.toLowerCase().includes(lowerQuery) ||
      (part.partDetails && part.partDetails.toLowerCase().includes(lowerQuery)) ||
      part.locationName.toLowerCase().includes(lowerQuery) ||
      part.container.toLowerCase().includes(lowerQuery) ||
      part.row.toLowerCase().includes(lowerQuery) ||
      part.position.toLowerCase().includes(lowerQuery)
    );
  }, [parts, searchQuery]);

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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search parts..."
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-8 px-12 border !border-gray-300 !border-solid">Part Name</th>
              <th className="py-8 px-12 border !border-gray-300 !border-solid">Details</th>
              <th className="py-8 px-12 border !border-gray-300 !border-solid">Location</th>
              <th className="py-8 px-12 border !border-gray-300 !border-solid">Container</th>
              <th className="py-8 px-12 border !border-gray-300 !border-solid">Row</th>
              <th className="py-8 px-12 border !border-gray-300 !border-solid">Position</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((part, index) => (
              <tr key={part.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-4 px-12 border !border-gray-300 !border-solid">{part.partName}</td>
                <td className="py-4 px-12 border !border-gray-300 !border-solid">{part.partDetails || '-'}</td>
                <td className="py-4 px-12 border !border-gray-300 !border-solid">{part.locationName}</td>
                <td className="py-4 px-12 border !border-gray-300 !border-solid">{part.container}</td>
                <td className="py-4 px-12 border !border-gray-300 !border-solid">{part.row}</td>
                <td className="py-4 px-12 border !border-gray-300 !border-solid">{part.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartsList;
