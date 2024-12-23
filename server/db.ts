import sqlite3, { Database } from 'sqlite3';
import { Location, Part } from './services';

const db = new Database ('parts-organizer.db', sqlite3.OPEN_READWRITE);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locationName TEXT NOT NULL,
    locationId TEXT UNIQUE NOT NULL,
    container TEXT NOT NULL,
    row TEXT NOT NULL,
    position TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partName TEXT NOT NULL,
    partId TEXT UNIQUE NOT NULL,
    partDetails TEXT,
    locationId TEXT,
    container TEXT NOT NULL,
    row TEXT NOT NULL,
    position TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location) REFERENCES locations(locationId)
  );
`);

// Location operations
export const insertLocation = async (locationName: string, locationId: string, container: string, row: string, position: string):
 Promise<Location> => {
  const result = db.run('INSERT INTO locations (locationName, locationId, container, row, position) VALUES (?, ?, ?, ?, ?)',
     [locationName, locationId, container, row, position]);
  return { result, locationName, locationId, container, row, position }as unknown as Location;
};

export const getLocations = async (): Promise<Location[]> => {
  return db.all('SELECT * FROM locations ORDER BY created_at DESC') as unknown as Location[];
};

export const getLocationById = async (id: string): Promise<Location> => {
  return db.get('SELECT * FROM locations WHERE locationId = ?', [id]) as unknown as Location;
};

// Part operations
export const insertPart = async (name: string, quantity: number, location: string, description?: string):
 Promise<Part> => {
  const result = db.run('INSERT INTO parts (name, quantity, location, description) VALUES (?, ?, ?, ?)',
  [name, quantity, location, description]);
  return { result, name, quantity, location, description } as unknown as Part; //id: result.lastID
};

export const getParts = async (): Promise<Part[]> => {
  return await db.all('SELECT * FROM parts ORDER BY created_at DESC') as unknown as Part[];
};

export const getPartById = async (id: string): Promise<Part> => {
  return await db.get('SELECT * FROM parts WHERE id = ?', [id]) as unknown as Part;
};

export const getPartsByLocation = async (locationId: string): Promise<Part[]> => {
  return await db.all('SELECT * FROM parts WHERE location = ? ORDER BY created_at DESC', [locationId]) as unknown as Part[];
};

export default db;
