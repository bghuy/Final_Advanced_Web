'use client'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../../redux/slices/userSlice';
import { getUserProfileFromCookie } from '../../../../actions/getUserProfileFromCookie';
import { getUserProfile } from '../../../../actions/getUserProfile';
export function UserProfileInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeUserProfile = async () => {
      try {
        // Check for user profile in headers (set by middleware)
        const userProfile = await getUserProfileFromCookie()
        console.log(userProfile,"userProfile");
        
        if (userProfile) {
          dispatch(setUserInfo(userProfile));
        } else {
          const user_data = await getUserProfile();
          if (user_data) {
            dispatch(setUserInfo(user_data));
          }
        }
      } catch (error) {
        console.log('Error initializing user profile:', error);
      }
    };

    initializeUserProfile();
  }, [dispatch]);

  return null; // This component doesn't render anything
}

