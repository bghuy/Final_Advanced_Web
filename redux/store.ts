import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

// Tạo Redux Store
export const store = configureStore({
  reducer: {
    example: userReducer,
  },
});

// Kiểu của RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
