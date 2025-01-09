import { createContext } from 'react';

export interface User {
  id: number;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getToken: () => string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
