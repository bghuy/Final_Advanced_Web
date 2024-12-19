import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string,
  email: string,
  id: string,
}

const initialState: UserState = {
  username: '',
  email: '',
  id: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ username: string, email: string, id: string }>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
