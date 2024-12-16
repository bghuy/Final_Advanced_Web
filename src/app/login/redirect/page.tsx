'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';

export default function OAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchProfile } = useAuth();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    
    if (access_token) {
      // Store the token
      localStorage.setItem('access_token', access_token);
      
      // Update axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Fetch profile and redirect
      const initAuth = async () => {
        try {
          await fetchProfile();
          router.push('/tasks');
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          router.push('/auth/login?error=profile_failed');
        }
      };

      initAuth();
    } else {
      router.push('/auth/login?error=oauth_failed');
    }
  }, [searchParams, router, fetchProfile]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Completing login...</h2>
        <p className="text-gray-500">Please wait while we redirect you.</p>
      </div>
    </div>
  );
} 