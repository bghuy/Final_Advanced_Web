import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
// import { cookies } from 'next/headers';
const isServer = typeof window === 'undefined';
// async function refreshToken() {
//   try {
//     const response = await axios.get('http://localhost:8080/api/v1/auth/refresh-token',{
//       withCredentials: true
//     });
//     const newToken = response.data.access_token;
//     if (isServer) {
//       const { cookies } = await import('next/headers');
//       const cookieStore = await cookies();
//       cookieStore.set('access_token', newToken);
//     } else { 
//       Cookies.set('access_token', newToken);
//     }
//     return newToken;
//   } catch (error) {
//     console.error('Failed to refresh token:', error);
//     throw error; // Re-throw the error for further handling
//   }
// }

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | undefined;

    if (isServer) {
      const { cookies } = await import('next/headers');
      // Server-side: Use Next.js cookies function
      const cookieStore = await cookies();
      token = cookieStore.get('access_token')?.value;
    } else {
      // Client-side: Use js-cookie
      token = Cookies.get('access_token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('Response:', response.headers);
    
    // Return only the data part of the response
    return response.data;
  },
  async (error: AxiosError) => {
    // if (error.response) {
    //   console.error('Response error:', error.response.data);
    //   console.error('Status:', error.response.status);
    // } else if (error.request) {
    //   console.error('Request error:', error.request);
    // } else {
    //   console.error('Error:', error.message);
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;

