import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import {
  insertLocation,
  getLocations,
  getLocationById,
  insertPart,
  getParts,
  getPartById,
  getPartsByLocation,
} from './db.ts';
import { validateUser, User } from './auth';

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React dev server replace when needed
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  }
}));

// Auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Auth routes
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await validateUser(username, password);
    if (user) {
      req.session.user = user;
      res.json({ user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Error logging out' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
});

app.get('/api/me', (req: Request, res: Response) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Routes for locations
app.get('/api/locations', requireAuth, async (req: Request, res: Response) => {
  try {
    const locations = await getLocations();
    res.json(locations);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/locations', requireAuth, async (req: Request, res: Response) => {
  const { locationName, container, row, position } = req.body;
  try {
    const location = await insertLocation(
      locationName,
      container,
      row,
      position
    );
    res.json(location);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// Route to get location by ID
app.get('/locations/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const location = await getLocationById(req.params.id as unknown as number);
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
    const parts = await getPartsByLocation(req.params.id);
    if (parts) {
      res.json(parts);
    } else {
      res.status(404).json({ error: 'No parts found for this location' });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// Routes for parts
app.post('/api/parts', requireAuth, async (req: Request, res: Response) => {
  const { partName, partDetails, locationName, container, row, position } =
    req.body;
  console.log('Received part data:', {
    partName,
    partDetails,
    locationName,
    container,
    row,
    position,
  });
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

app.get('/api/parts', requireAuth, async (req: Request, res: Response) => {
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
    const part = await getPartById(parseInt(req.params.id));
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
    const parts = await getPartsByLocation(req.params.locationName);
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
