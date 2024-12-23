import React, { useState, useEffect }  from 'react';
import { partsApi, Location } from '../../../src/api/partsApi';


const LocationForm = () => {
    const [locationName, setLocationName] = useState<string>('');
    const [locationId, setLocationId] = useState<string>('');
    const [container, setContainer] = useState<string>('');
    const [row, setRow] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        loadLocations();
    }, []);

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
        
        if (!locationName || !locationId || !container || !row || !position) {
            setAlertMessage('Please fill in all required fields');
            return;
        }

        try {
            const newLocation: Location = {
                locationName,
                locationId,
                container,
                row,
                position
            };

            await partsApi.addLocation(newLocation);
            setAlertMessage('Location added successfully!');
            setLocationName('');
            setLocationId('');
            setContainer('');
            setRow('');
            setPosition('');
            // Reload locations
            loadLocations();
        } catch (error) {
            console.error('Error adding location:', error);
            setAlertMessage('Failed to add location. Please try again.');
        }
    };

    return (
        <div className="container mx-100 mw-100 mt-10">
            <h2 className="">Add New Location</h2>
            <form id="locationForm" className="" onSubmit={handleSubmit}>
                <div className="loc-form">
                    <label htmlFor="locationName" className="">Location Name</label>
                    <input type="text" className="" id="locationName" required value={locationName} 
                    onChange={(e) => setLocationName(e.target.value)} />
                </div>
                <div className="loc-form">
                    <label htmlFor="locationId" className="">Location ID</label>
                    <input type="text" className="" id="locationId" required value={locationId} 
                    onChange={(e) => setLocationId(e.target.value)} />
                </div>
                <div className="loc-form">
                    <label htmlFor="container" className="">Container Name</label>
                    <input type="text" className="" id="container" required value={container} 
                    onChange={(e) => setContainer(e.target.value)} />
                </div>
                <div className="loc-form">
                    <label htmlFor="row" className="">Row Number</label>
                    <input type="text" className="" id="row" required value={row} 
                    onChange={(e) => setRow(e.target.value)} />
                </div>
                <div className="loc-form">
                    <label htmlFor="position" className="">Position On Row</label>
                    <input type="text" className="" id="position" required value={position} 
                    onChange={(e) => setPosition(e.target.value)} />
                </div>
                <button type="submit" className="">Add Location</button>
            </form>
            {alertMessage && <p className="text-red-500 text-xs italic">{alertMessage}</p>}
            
            {locations.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Existing Locations</h3>
                    <div className="grid gap-4">
                        {locations.map((location) => (
                            <div key={location.locationId} className="bg-white p-4 rounded shadow">
                                <h4 className="font-bold">{location.locationName}</h4>
                                <p>ID: {location.locationId}</p>
                                <p>Container: {location.container}</p>
                                <p>Row: {location.row}</p>
                                <p>Position: {location.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationForm;
