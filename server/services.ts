import db from './db.ts';

// interface
export interface Location {
  id?: number;
  locationName: string;
  container: string;
  row: string;
  position: string;
}

export interface Part {
  id?: number;
  partName: string;
  partDetails: string;
  locationName: string;
  container: string;
  row: string;
  position: string;
}

export const LocationService = {
  create: (location: Location) => {
    const stmt = db.prepare(`
      INSERT INTO locations (locationName, container, row, position)
      VALUES (@locationName, @container, @row, @position)
    `);
    return stmt.run(location);
  },

  getAll: (): Location[] => {
    const stmt = db.prepare(`SELECT * FROM locations ORDER BY created_at DESC`);
    return stmt.all() as unknown as Location[];
  },

  getById: (id: number): Location | undefined => {
    const stmt = db.prepare(`SELECT * FROM locations WHERE id = ?`);
    const result = stmt.get(id);
    return (result as unknown as Location) || undefined;
  },
};

export const PartService = {
  create: (part: Part) => {
    const stmt = db.prepare(`
      INSERT INTO parts (partName, partDetails, locationName, container, row, position)
      VALUES (@partName, @partDetails, @locationName, @container, @row, @position)
    `);
    return stmt.run(part);
  },

  getAll: (): Part[] | undefined => {
    const stmt = db.prepare(`SELECT * FROM parts ORDER BY created_at DESC`);
    return stmt.all() as unknown as Part[];
  },

  getById: (id: number): Part | undefined => {
    const stmt = db.prepare(`SELECT * FROM parts WHERE id = ?`);
    return stmt.get(id) as unknown as Part;
  },

  getPartByLocation: (locationId: string): Part[] => {
    const stmt = db.prepare(`SELECT * FROM parts WHERE locationId = ?`);
    return stmt.all(locationId) as unknown as Part[];
  },
};
