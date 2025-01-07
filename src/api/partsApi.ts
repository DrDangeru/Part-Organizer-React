const API_BASE_URL = 'http://localhost:3000/api';

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
    const response = await fetch(`${API_BASE_URL}/parts`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getPartsByName(partName: string): Promise<Part[]> {
    const response = await fetch(`${API_BASE_URL}/parts/${partName}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async addPart(part: Part): Promise<Part> {
    const response = await fetch(`${API_BASE_URL}/parts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(part),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getLocations(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async addLocation(location: Location): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(location),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getByLocationByName(locationName: string): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations/${locationName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ locationName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as unknown as Location;
  },

  async getPartsByLocation(locationName: string): Promise<Part[]> {
    const response = await fetch(`${API_BASE_URL}/parts/location/${encodeURIComponent(locationName)}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
