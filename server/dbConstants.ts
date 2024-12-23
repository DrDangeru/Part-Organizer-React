import { getLocations, getParts } from './db.ts';

export const dbService = {
  locations : getLocations, 
  parts: getParts,
};
