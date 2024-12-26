import React, { useState, useEffect } from 'react';
import { partsApi, Part, Location } from '../../src/api/partsApi';

const PartsForm = () => {
    const [partName, setPartName] = useState<string>('');
    const [partDetails, setPartDetails] = useState<string>('');
    const [locationId, setLocationId] = useState<string>('');
    const [container, setContainer] = useState<string>('');
    const [row, setRow] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [parts, setParts] = useState<Part[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        loadParts();
        loadLocations(); 
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!partName || !locationId || !container || !row || !position) {
            setAlertMessage('Please fill in all required fields (including location)');
            return;
        }

        try {
            const newPart: Part = {
                partName,
                partDetails,
                locationName: locationId, 
                container,
                row,
                position
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
            setAlertMessage(error instanceof Error ? error.message : 'Failed to add part. Please try again.');
        }
    };

    const loadParts = async () => {
        try {
            const allParts = await partsApi.getParts();
            setParts(allParts);
        } catch (error) {
            console.error('Error loading parts:', error);
            setAlertMessage('Failed to load parts');
        }
    };

    const loadLocations = async () => {
        try {
            const allLocations = await partsApi.getLocations();
            setLocations(allLocations);
        } catch (error) {
            console.error('Error loading locations:', error);
            setAlertMessage('Failed to load locations');
        }
    };

    const getLocationDetails = (locationName: string) => {
        const location = locations.find(loc => loc.locationName === locationName);
        if (location) {
            setContainer(location.container);
            setRow(location.row);
            setPosition(location.position);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Add New Part</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="part-form">
                    <label htmlFor="partName" className="block text-gray-700 text-sm font-bold mb-2">Part Name*</label>
                    <input 
                        type="text" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="partName" 
                        value={partName} 
                        onChange={(e) => setPartName(e.target.value)}
                        required
                    />
                </div>
                
                <div className="part-form">
                    <label htmlFor="partDetails" className="block text-gray-700 text-sm font-bold mb-2">Part Details</label>
                    <input 
                        type="text" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="partDetails" 
                        value={partDetails} 
                        onChange={(e) => setPartDetails(e.target.value)}
                    />
                </div>

                <div className="part-form">
                    <label htmlFor="locationId" className="block text-gray-700 text-sm font-bold mb-2">Location*</label>
                    <select 
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!locationId && 'border-red-500'}`}
                        id="locationId" 
                        value={locationId} 
                        onChange={(e) => {
                            setLocationId(e.target.value);
                            getLocationDetails(e.target.value);
                        }}
                        required
                    >
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                            <option key={location.locationName} value={location.locationName}>
                                {location.locationName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="part-form">
                    <label htmlFor="container" className="block text-gray-700 text-sm font-bold mb-2">Container*</label>
                    <input 
                        type="text" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        id="container" 
                        value={container}
                        readOnly
                        required
                    />
                </div>

                <div className="part-form">
                    <label htmlFor="row" className="block text-gray-700 text-sm font-bold mb-2">Row*</label>
                    <input 
                        type="text" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="row" 
                        value={row}
                        onChange={(e) => setRow(e.target.value)}
                        required
                    />
                </div>

                <div className="part-form">
                    <label htmlFor="position" className="block text-gray-700 text-sm font-bold mb-2">Position*</label>
                    <input 
                        type="text" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="position" 
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Part
                </button>
            </form>

            {alertMessage && (
                <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Parts List</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {parts.map((part) => (
                        <div key={part.id} className="bg-white shadow rounded p-4">
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