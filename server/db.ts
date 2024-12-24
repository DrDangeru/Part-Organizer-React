import sqlite3 from 'sqlite3';
import { Location, Part } from './services';

const db = new sqlite3.Database('parts-organizer.db');

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
    locationName TEXT NOT NULL,
    container TEXT NOT NULL,
    row TEXT NOT NULL,
    position TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (locationName) REFERENCES locations(locationName)
  );
`);

// Location operations
export const insertLocation = (locationName: string, locationId: string, container: string, row: string, position: string): Promise<Location> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO locations (locationName, locationId, container, row, position) VALUES (?, ?, ?, ?, ?)',
      [locationName, locationId, container, row, position],
      function(err) {
        if (err) reject(err);
        resolve({ locationName, locationId, container, row, position } as Location);
      }
    );
  });
};

export const getLocations = (): Promise<Location[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM locations ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      resolve(rows as Location[]);
    });
  });
};

export const getLocationById = (id: string): Promise<Location> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM locations WHERE locationId = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row as Location);
    });
  });
};

// Part operations
export const insertPart = (partName: string, partId: string, partDetails: string, 
  locationName: string, container: string, row: string, position: string): Promise<Part> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO parts (partName, partId, partDetails, locationName, container, row, position) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [partName, partId, partDetails, locationName, container, row, position],
      function(err) {
        if (err) reject(err);
        resolve({ partName, partId, partDetails, locationName, container, row, position } as Part);
      }
    );
  });
};

export const getParts = (): Promise<Part[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM parts ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      resolve(rows as Part[]);
    });
  });
};

export const getPartById = (id: string): Promise<Part> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM parts WHERE partId = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row as Part);
    });
  });
};

export const getPartsByLocation = (locationName: string): Promise<Part[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM parts WHERE locationName = ? ORDER BY created_at DESC', [locationName], (err, rows) => {
      if (err) reject(err);
      resolve(rows as Part[]);
    });
  });
};

export default db;
