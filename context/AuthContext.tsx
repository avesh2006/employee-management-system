import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, userService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  register: (userData: Partial<User>) => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock fallback users for demo purposes when backend is offline
const MOCK_ADMIN: User = {
  id: '1',
  name: 'Sarah Connor',
  email: 'admin@ems.com',
  role: UserRole.ADMIN,
  department: 'Operations',
  xp: 0,
  level: 10,
  avatarUrl: 'https://picsum.photos/200',
  age: 34
};

const MOCK_EMPLOYEE: User = {
  id: '2',
  name: 'John Doe',
  email: 'john@ems.com',
  role: UserRole.EMPLOYEE,
  department: 'Engineering',
  xp: 2450,
  level: 5,
  avatarUrl: 'https://picsum.photos/201',
  age: 28
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    
    try {
      // Attempt to hit the real backend
      const response = await authService.login(email, role);
      
      const { user: apiUser, token } = response.data;
      
      localStorage.setItem('ems_token', token);
      localStorage.setItem('ems_user', JSON.stringify(apiUser));
      setUser(apiUser);
      
    } catch (err) {
      console.warn("Backend connection failed, using mock fallback");
      // Fallback Logic (Simulated)
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

      let baseUser = role === UserRole.ADMIN ? MOCK_ADMIN : MOCK_EMPLOYEE;
      const loggedInUser: User = {
          ...baseUser,
          email: email,
          name: email !== baseUser.email ? email.split('@')[0] : baseUser.name
      };
      
      setUser(loggedInUser);
      localStorage.setItem('ems_user', JSON.stringify(loggedInUser));
      // For mock mode, we set a fake token
      localStorage.setItem('ems_token', 'mock-jwt-token-123');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
        await authService.register(userData);
        // After register, auto-login logic typically happens or redirect to login
        
        // Simulating immediate login after register success
        const newUser: User = {
            id: Date.now().toString(),
            name: userData.name || 'New User',
            email: userData.email || '',
            role: userData.role || UserRole.EMPLOYEE,
            department: userData.department || 'General',
            xp: 0,
            level: 1,
            avatarUrl: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
            age: 25
        };

        setUser(newUser);
        localStorage.setItem('ems_user', JSON.stringify(newUser));
        localStorage.setItem('ems_token', 'mock-jwt-token-new-user');
        
        return true;
    } catch (err) {
        console.warn("Backend register failed, using mock fallback");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
            id: Date.now().toString(),
            name: userData.name || 'New User',
            email: userData.email || '',
            role: userData.role || UserRole.EMPLOYEE,
            department: userData.department || 'General',
            xp: 0,
            level: 1,
            avatarUrl: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
            age: 25
        };

        setUser(newUser);
        localStorage.setItem('ems_user', JSON.stringify(newUser));
        localStorage.setItem('ems_token', 'mock-jwt-token-new-user');
        return true;
    } finally {
        setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
        // Try calling API
        try {
            await userService.updateProfile(data);
        } catch (e) {
            console.warn("Backend update failed, updating local state only");
        }

        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('ems_user', JSON.stringify(updatedUser));
        return true;
    } catch (err) {
        setError("Failed to update profile");
        return false;
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, register, updateUserProfile, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};