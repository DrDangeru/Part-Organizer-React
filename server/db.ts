import sqlite3 from 'sqlite3';
import { Location, Part } from './services';

const db = new sqlite3.Database('parts-organizer.db', err => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to database successfully');
  }
});

// Create tables if they don't exist
db.exec(
  `
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locationName TEXT UNIQUE NOT NULL,
    container TEXT NOT NULL,
    row TEXT NOT NULL,
    position TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partName TEXT NOT NULL,
    partDetails TEXT,
    locationName TEXT NOT NULL,
    container TEXT NOT NULL,
    row TEXT NOT NULL,
    position TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (locationName) REFERENCES locations(locationName)
  );
`,
  err => {
    if (err) {
      console.error('Error creating tables:', err);
    } else {
      console.log('Database tables created successfully');
      // Verify tables were created
      db.all(
        "SELECT name FROM sqlite_master WHERE type='table'",
        [],
        (err, tables) => {
          if (err) {
            console.error('Error checking tables:', err);
          } else {
            console.log('Available tables:', tables);
          }
        }
      );
    }
  }
);

// Location operations
export const insertLocation = (
  locationName: string,
  container: string,
  row: string,
  position: string
): Promise<Location> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO locations (locationName, container, row, position) VALUES (?, ?, ?, ?)',
      [locationName, container, row, position],
      function (err) {
        if (err) reject(err);
        resolve({
          id: this.lastID,
          locationName,
          container,
          row,
          position,
        } as Location);
      }
    );
  });
};

export const getLocations = (): Promise<Location[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM locations ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        console.error('Error getting locations:', err);
        reject(err);
        return;
      }
      resolve(rows as Location[]);
    });
  });
};

export const getLocationById = (id: number): Promise<Location> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM locations WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row as Location);
    });
  });
};

// Part operations
export const insertPart = (
  partName: string,
  partDetails: string,
  locationName: string,
  container: string,
  row: string,
  position: string
): Promise<Part> => {
  return new Promise((resolve, reject) => {
    console.log('Attempting to insert part:', {
      partName,
      partDetails,
      locationName,
      container,
      row,
      position,
    });

    // First check if the location exists
    db.get(
      'SELECT locationName FROM locations WHERE locationName = ?',
      [locationName],
      (err, location) => {
        if (err) {
          console.error('Error checking location:', err);
          reject(new Error('Error checking location'));
          return;
        }

        if (!location) {
          console.error('Location not found:', locationName);
          reject(new Error(`Location "${locationName}" not found`));
          return;
        }

        // Now insert the part
        db.run(
          'INSERT INTO parts (partName, partDetails, locationName, container, row, position) VALUES (?, ?, ?, ?, ?, ?)',
          [partName, partDetails, locationName, container, row, position],
          function (err) {
            if (err) {
              console.error('Error inserting part:', err);
              reject(err);
              return;
            }
            const part = {
              id: this.lastID,
              partName,
              partDetails,
              locationName,
              container,
              row,
              position,
            } as Part;
            console.log('Part inserted successfully:', part);
            resolve(part);
          }
        );
      }
    );
  });
};

export const getParts = (): Promise<Part[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM parts ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        console.error('Error getting parts:', err);
        reject(err);
        return;
      }
      console.log('Retrieved parts:', rows);
      resolve(rows as Part[]);
    });
  });
};

export const getPartById = (id: number): Promise<Part> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM parts WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row as Part);
    });
  });
};

export const getPartsByLocation = (locationName: string): Promise<Part[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM parts WHERE locationName = ? ORDER BY created_at DESC',
      [locationName],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows as Part[]);
      }
    );
  });
};

export default db;
