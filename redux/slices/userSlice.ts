import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string,
  email: string,
  id: string,
  role?: string
  verified?: boolean
}

const initialState: UserState = {
  username: '',
  email: '',
  id: '',
  role: '',
  verified: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ username: string, email: string, id: string, role: string, verified: boolean }>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload?.role;
      state.verified = action.payload?.verified;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
