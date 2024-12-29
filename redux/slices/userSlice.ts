import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string,
  email: string,
  id: string,
  role?: string
}

const initialState: UserState = {
  username: '',
  email: '',
  id: '',
  role: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ username: string, email: string, id: string, role: string }>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload?.role;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
