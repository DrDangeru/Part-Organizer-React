const API_BASE_URL = 'http://localhost:3000';

export interface Part {
  id?: number;
  partName: string;
  partDetails: string;
  locationName: string;
  container: string;
  row: string;
  position: string;
}

export interface Location {
  id?: number;
  locationName: string;
  container: string;
  row: string;
  position: string;
}

export const partsApi = {
  async getParts(): Promise<Part[]> {
    const response = await fetch(`${API_BASE_URL}/parts`);
    return response.json();
  },

  async getPartsByName(partName: string): Promise<Part[]> {
    const response = await fetch(`${API_BASE_URL}/parts/${partName}`);
    return response.json();
  },

  async addPart(part: Part): Promise<Part> {
    const response = await fetch(`${API_BASE_URL}/parts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(part),
    });
    return response.json();
  },

  async getLocations(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/locations`);
    return response.json();
  },

  async addLocation(location: Location): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    return response.json();
  },

  async getByLocationByName(locationName: string): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations/${locationName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    return response.json() as unknown as Location;
  },
};
