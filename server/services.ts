import db from './db.ts';


export interface Location { // interface
  locationName: string;
  locationId: string;
  container: string;
  row: string;
  position: string;
}

export interface Part {
  partName: string;
  partId: string;
  partDetails: string;
  locationName: string;
  container: string;
  row: string;
  position: string;
}

export const LocationService = {
  create: (location: Location) => {
    const stmt = db.prepare(`
      INSERT INTO locations (locationName, locationId, container, row, position)
      VALUES (@locationName, @locationId, @container, @row, @position)
    `);
    return stmt.run(location);
  },

  getAll: (): Location[] => {
    const stmt = db.prepare(`SELECT * FROM locations ORDER BY created_at DESC`);
    return stmt.all() as unknown as Location[];
  },

  getById: (locationId : string): Location | undefined => {
    const stmt = db.prepare(`SELECT * FROM locations WHERE locationId = ?`);
    const result = stmt.get(locationId);
    return result  as unknown as Location || undefined;
  }
};

export const PartService = {
  create: (part: Part) => {
    const stmt = db.prepare(`
      INSERT INTO parts (partName, partId, partDetails, locationId, container, row, position)
      VALUES (@partName, @partId, @partDetails, @locationId, @container, @row, @position)
    `);
    return stmt.run(part);
  },

  getAll: (): Part[] | undefined => {
    const stmt = db.prepare(`SELECT * FROM parts ORDER BY created_at DESC`);
    return stmt.all() as unknown as Part[];
  },

  getById: (partId: string): Part | undefined => {
    const stmt = db.prepare(`SELECT * FROM parts WHERE partId = ?`);
    return stmt.get(partId) as unknown as Part;
  },

  getPartByLocation: (locationId: string): Part[] => {
    const stmt = db.prepare(`SELECT * FROM parts WHERE locationId = ?`);
    return stmt.all(locationId) as unknown as Part[];
  }
};
