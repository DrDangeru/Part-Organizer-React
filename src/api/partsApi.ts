import { useAuth } from '../hooks/useAuth';
import { useMemo } from 'react';

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

export const usePartsApi = () => {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const getAuthHeaders = () => {
      const token = getToken();
      return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };
    };

    return {
      async getParts(): Promise<Part[]> {
        const response = await fetch(`${API_BASE_URL}/parts`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },

      async getPartsByName(partName: string): Promise<Part[]> {
        const response = await fetch(`${API_BASE_URL}/parts/${partName}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },

      async addPart(part: Part): Promise<Part> {
        const response = await fetch(`${API_BASE_URL}/parts`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(part),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },

      async getLocations(): Promise<Location[]> {
        const response = await fetch(`${API_BASE_URL}/locations`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },

      async addLocation(location: Location): Promise<Location> {
        const response = await fetch(`${API_BASE_URL}/locations`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(location),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },

      async getPartsByLocation(locationName: string): Promise<Part[]> {
        const response = await fetch(
          `${API_BASE_URL}/parts/location/${encodeURIComponent(locationName)}`,
          {
            headers: getAuthHeaders(),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
    };
  }, [getToken]);

  return api;
};
