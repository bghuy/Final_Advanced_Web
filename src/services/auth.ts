import api from '@/lib/axios';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  access_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', input);
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async getProfile(): Promise<Omit<AuthResponse, 'access_token'>> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('http://localhost:8080/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    if (typeof window !== 'undefined' && data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  initiateGoogleLogin() {
    window.location.href = 'http://localhost:8080/api/v1/auth/social/google/login';
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }
}; 