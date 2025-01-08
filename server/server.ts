import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {
  insertLocation,
  getLocations,
  getLocationById,
  insertPart,
  getParts,
  getPartById,
  getPartsByLocation,
} from './db';
import { validateUser, User } from './auth';
import { generateToken, verifyToken, extractTokenFromHeader } from './jwt';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// Auth middleware
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await validateUser(username, password);
    if (user) {
      const token = generateToken(user);
      res.json({ token, user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/api/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// Routes for locations
app.post('/api/locations', requireAuth, async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const location = await insertLocation(name, description);
    res.json(location);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/api/locations', requireAuth, async (_req: Request, res: Response) => {
  try {
    const locations = await getLocations();
    res.json(locations);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/api/locations/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.id);
    if (isNaN(locationId)) {
      return res.status(400).json({ error: 'Invalid location ID' });
    }

    const location = await getLocationById(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// Route to get parts for a specific location
app.get('/locations/:id/parts', requireAuth, async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.id);
    if (isNaN(locationId)) {
      return res.status(400).json({ error: 'Invalid location ID' });
    }

    const parts = await getPartsByLocation(locationId);
    if (!parts || parts.length === 0) {
      return res.status(404).json({ error: 'No parts found for this location' });
    }
    res.json(parts);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// Routes for parts
app.post('/api/parts', requireAuth, async (req: Request, res: Response) => {
  const { partName, partDetails, locationName, container, row, position } = req.body;
  
  if (!partName || !locationName) {
    return res.status(400).json({ error: 'Part name and location name are required' });
  }

  try {
    const part = await insertPart(
      partName,
      partDetails,
      locationName,
      container,
      row,
      position
    );
    res.json(part);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/api/parts', requireAuth, async (_req: Request, res: Response) => {
  try {
    const parts = await getParts();
    res.json(parts);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/api/parts/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const partId = parseInt(req.params.id);
    if (isNaN(partId)) {
      return res.status(400).json({ error: 'Invalid part ID' });
    }

    const part = await getPartById(partId);
    if (!part) {
      return res.status(404).json({ error: 'Part not found' });
    }
    res.json(part);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/api/parts/location/:locationName', requireAuth, async (req: Request, res: Response) => {
  try {
    const { locationName } = req.params;
    if (!locationName) {
      return res.status(400).json({ error: 'Location name is required' });
    }

    const parts = await getPartsByLocation(locationName);
    if (!parts || parts.length === 0) {
      return res.status(404).json({ error: 'No parts found for this location' });
    }
    res.json(parts);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
