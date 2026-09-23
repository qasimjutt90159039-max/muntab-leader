import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, pass?: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, pass?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  quickLoginAsAdmin: () => void;
  quickLoginAsCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    storageService.initializeStorage();
    const storedUser = storageService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    try {
      const found = storageService.loginUser(email);
      setUser(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    try {
      const newUser = storageService.registerUser(name, email, phone, 'customer');
      setUser(newUser);
      showToast(`Account registered successfully. Welcome, ${name}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = () => {
    storageService.setCurrentUser(null);
    setUser(null);
    showToast('You have been signed out.', 'info');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      const updated = storageService.updateUserProfile(user.id, data);
      if (updated) {
        setUser({ ...updated });
        showToast('Profile updated successfully.', 'success');
        return true;
      }
      return false;
    } catch {
      showToast('Failed to update profile.', 'error');
      return false;
    }
  };

  const quickLoginAsAdmin = () => {
    const admin = storageService.loginUser('admin@mutalibleather.pk');
    setUser(admin);
    showToast('Logged in as Store Administrator.', 'success');
  };

  const quickLoginAsCustomer = () => {
    const customer = storageService.loginUser('ahmed.malik@example.com');
    setUser(customer);
    showToast('Logged in as customer: Ahmed Malik.', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        quickLoginAsAdmin,
        quickLoginAsCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
