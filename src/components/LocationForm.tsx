import React, { useState, useEffect }  from 'react';
import { partsApi, Location } from '../api/partsApi';

const LocationForm = () => {
    const [locationName, setLocationName] = useState<string>('');
    const [container, setContainer] = useState<string>('');
    const [row, setRow] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        loadLocations();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!locationName || !container || !row || !position) {
            setAlertMessage('Please fill in all required fields');
            return;
        }

        try {
            const newLocation: Location = {
                locationName,
                container,
                row,
                position
            };

            console.log('Submitting location:', newLocation);
            await partsApi.addLocation(newLocation);
            await loadLocations();
            setAlertMessage('Location added successfully!');

            // Reset form
            setLocationName('');
            setContainer('');
            setRow('');
            setPosition('');
        } catch (error) {
            console.error('Error adding location:', error);
            setAlertMessage(error instanceof Error ? error.message : 'Failed to add location. Please try again.');
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Add New Location</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="location-form">
                    <label htmlFor="locationName" className="block text-gray-700 text-sm font-bold mb-2">Location Name*</label>
                    <input 
                        type="text" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="locationName" 
                        value={locationName} 
                        onChange={(e) => setLocationName(e.target.value)}
                        required
                    />
                </div>

                <div className="location-form">
                    <label htmlFor="container" className="block text-gray-700 text-sm font-bold mb-2">Container*</label>
                    <input 
                        type="text" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="container" 
                        value={container} 
                        onChange={(e) => setContainer(e.target.value)}
                        required
                    />
                </div>

                <div className="location-form">
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

                <div className="location-form">
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
                    Add Location
                </button>
            </form>

            {alertMessage && (
                <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Locations List</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {locations.map((location) => (
                        <div key={location.id} className="bg-white shadow rounded p-4">
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
