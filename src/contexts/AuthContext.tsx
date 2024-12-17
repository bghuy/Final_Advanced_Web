'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, AuthResponse } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: Omit<AuthResponse, 'access_token'> | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
  loading: boolean;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<AuthResponse, 'access_token'> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!localStorage.getItem('access_token')) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profile = await authService.getProfile();
      setUser(profile);
      console.log('Profile fetched:', profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setUser(null);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('access_token', response.access_token);
      await fetchProfile();
      router.push('/tasks');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authService.register({ username, email, password });
      localStorage.setItem('access_token', response.access_token);
      await fetchProfile();
      router.push('/tasks');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      router.push('/auth/login');
    }
  };

  const loginWithGoogle = () => {
    authService.initiateGoogleLogin();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loginWithGoogle, 
      loading,
      fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 