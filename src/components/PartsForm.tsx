import React, { useState, useEffect } from 'react';
import { partsApi, Part, Location } from '../../src/api/partsApi';

const PartsForm = () => {
    const [partName, setPartName] = useState<string>('');
    const [partId, setPartId] = useState<string>('');
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

    const loadParts = async () => {
        try {
            const allParts = await partsApi.getParts() as Part[];  
            setParts(allParts);
        } catch (error) {
            console.error('Error loading parts:', error);
            setAlertMessage('Failed to load parts');
        }
    };

    const loadLocations = async () => {
        try {
            const allLocations = await partsApi.getLocations() as Location[];
            setLocations(allLocations);
        } catch (error) {
            console.error('Error loading locations:', error);
            setAlertMessage('Failed to load locations');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!partName || !partId || !container || !row || !position) {
            setAlertMessage('Please fill in all required fields');
            return;
        }

        try {
            const newPart: Part = {
                partName,
                partId,
                partDetails,
                locationId: locationId || '',
                container,
                row,
                position
            };

            await partsApi.addPart(newPart);
            setAlertMessage('Part added successfully!');
            
            // Reset form
            setPartName('');
            setPartId('');
            setPartDetails('');
            setLocationId('');
            setContainer('');
            setRow('');
            setPosition('');
            
            // Reload parts
            loadParts();
        } catch (error) {
            console.error('Error adding part:', error);
            setAlertMessage('Failed to add part. Please try again.');
        }
    };

    return (
        <div className="container mx-100 mw-100 mt-10">
            <h2 className="">Add New Part</h2>
            <form id="partsForm" className="" onSubmit={handleSubmit}>
                <div className="part-form">
                    <label htmlFor="partName" className="block text-gray-700 text-sm font-bold mb-2">Part Name*</label>
                    <input type="text" className="" id="partName" required value={partName} onChange={(e) => setPartName(e.target.value)} />
                </div>
                <div className="part-form">
                    <label htmlFor="partId" className="block text-gray-700 text-sm font-bold mb-2">Part ID*</label>
                    <input type="text" className="" id="partId" required value={partId} onChange={(e) => setPartId(e.target.value)} />
                </div>
                <div className="part-form">
                    <label htmlFor="partDetails" className="block text-gray-700 text-sm font-bold mb-2">Part Details</label>
                    <input type="text" className="" id="partDetails" value={partDetails} onChange={(e) => setPartDetails(e.target.value)} />
                </div>
                <div className="part-form">
                    <label htmlFor="locationId" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                    <select 
                        className="" 
                        id="locationId" 
                        value={locationId} 
                        onChange={(e) => setLocationId(e.target.value)}
                    >
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                            <option key={location.locationId} value={location.locationId}>
                                {location.locationName} ({location.locationId})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="part-form">
                    <label htmlFor="container" className="block text-gray-700 text-sm font-bold mb-2">Container*</label>
                    <input type="text" className="" id="container" required value={container} onChange={(e) => setContainer(e.target.value)} />
                </div>
                <div className="part-form">
                    <label htmlFor="row" className="block text-gray-700 text-sm font-bold mb-2">Row*</label>
                    <input type="text" className="" id="row" required value={row} onChange={(e) => setRow(e.target.value)} />
                </div>
                <div className="part-form">
                    <label htmlFor="position" className="block text-gray-700 text-sm font-bold mb-2">Position*</label>
                    <input type="text" className="" id="position" required value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                <button type="submit" className="">Add Part</button>
            </form>
            {alertMessage && <p className="text-red-500 text-xs italic">{alertMessage}</p>}
            
            {parts.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Existing Parts</h3>
                    <div className="grid gap-4">
                        {parts.map((part) => (
                            <div key={part.partId} className="bg-white p-4 rounded shadow">
                                <h4 className="font-bold">{part.partName}</h4>
                                <p>ID: {part.partId}</p>
                                {part.partDetails && <p>Details: {part.partDetails}</p>}
                                {part.locationId && <p>Location ID: {part.locationId}</p>}
                                <p>Container: {part.container}</p>
                                <p>Row: {part.row}</p>
                                <p>Position: {part.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartsForm;