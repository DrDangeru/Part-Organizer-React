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
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes for locations
app.post('/locations', async (req, res) => {
  const { locationName, locationId, container, row, position } = req.body;
  try {
    const location = await insertLocation(locationName, locationId, container, row, position);
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error});
  }
});

app.get('/locations', async (req, res) => {
  try {
    const locations = await getLocations();
    res.json(locations);
} catch (error) {
    res.status(500).json({ error: error });
  }
});


// app.get('/locations/:id', (req, res) => {
//   const location = getLocationById.get(req.params.id);
//   res.json(location);
// });

// app.get('/locations/:id', (req, res) => {
//   const parts = getPartsByLocation.get(req.params.id);
//   res.json(parts);
// })

// Route to get location by ID
app.get('/locations/:id', (req, res) => {
  try{
  const location = getLocationById(req.params.id);
  if (!location) {
    return res.status(404).json({ error: 'Location not found' });
   }}
   catch (error) {
    res.status(500).json({ error: error });
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
  const { name, quantity, location, description } = req.body;
  try {
    const part = await insertPart(name, quantity, location, description);
    res.json(part);
  } catch (error) {
    res.status(500).json({ error: error  });
  }
});

app.get('/parts', async (req, res) => {
  try {
    const parts = await getParts();
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/parts/:id', async (req, res) => {
  try {
    const part = await getPartById(req.params.id);
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