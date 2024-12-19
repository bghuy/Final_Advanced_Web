'use client'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../../redux/slices/userSlice';
import Cookies from 'js-cookie';
export function UserProfileInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeUserProfile = async () => {
      try {
        // Check for user profile in headers (set by middleware)
        const userProfile = await Cookies.get("user_profile");
        const userProfileHeader = JSON.parse(userProfile || "")
        console.log(userProfileHeader,"use");
        if (userProfileHeader) {
          const userProfile = JSON.parse(userProfileHeader);
          dispatch(setUserInfo(userProfile));
        } else {
          // If not found in headers, try to fetch it
          const response = await fetch('/api/user-profile');
          if (response.ok) {
            const userProfile = await response.json();
            dispatch(setUserInfo(userProfile));
          }
        }
      } catch (error) {
        console.error('Error initializing user profile:', error);
      }
    };

    initializeUserProfile();
  }, [dispatch]);

  return null; // This component doesn't render anything
}

