import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContext, User, AuthContextType } from './AuthContextDef';

export { AuthContext, type User, type AuthContextType };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // If token is invalid, clear it
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [token, checkAuth]);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}
