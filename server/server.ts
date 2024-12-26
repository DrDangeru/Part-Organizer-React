import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {
  insertLocation,
  getLocations,
  getLocationById,
  insertPart,
  getParts,
  getPartById,
  getPartsByLocation
} from './db.ts';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes for locations
app.post('/locations', async (req, res) => {
  const { locationName, container, row, position } = req.body;
  try {
    const location = await insertLocation(locationName, container, row, position);
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error});
  }
});

app.get('/locations', async (req, res) => {
  try {
    const locations = await getLocations();
    if (!locations) {
      return res.status(404).json({ error: 'No locations found' });
    }
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get location by ID
app.get('/locations/:id', async (req, res) => {
  try {
    const location = await getLocationById(req.params.id as unknown as number);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get parts for a specific location
app.get('/locations/:id/parts', async (req, res) => {
  try {
    const parts = await getPartsByLocation(req.params.id);
    if (parts) {
      res.json(parts);
    } else {
      res.status(404).json({ error: 'No parts found for this location' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Routes for parts
app.post('/parts', async (req, res) => {
  const { partName, partDetails, locationName, container, row, position} = req.body;
  console.log('Received part data:', { partName, partDetails, locationName, container, row, position });
  
  try {
    const part = await insertPart(partName, partDetails, locationName, container, row, position);
    console.log('Part inserted successfully:', part);
    res.json(part);
  } catch (error) {
    console.error('Error inserting part:', error);
    res.status(500).json({ error: error ||'Error inserting part' });
  }
});

app.get('/parts', async (req, res) => {
  try {
    const parts = await getParts();
    console.log('Retrieved parts:', parts);
    res.json(parts);
  } catch (error) {
    console.error('Error getting parts:', error);
    res.status(500).json({ error: error || 'Error getting parts' });
  }
});

app.get('/parts/:id', async (req, res) => {
  try {
    const part = await getPartById(req.params.id as unknown as number);
    if (part) {
      res.json(part);
    } else {
      res.status(404).json({ error: 'Part not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/parts/location/:locationId', async (req, res) => {
  try {
    const parts = await getPartsByLocation(req.params.locationId);
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});