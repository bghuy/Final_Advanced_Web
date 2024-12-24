import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
  username: string,
  email: string,
  id: string,
}

const initialState: TaskState = {
  username: '',
  email: '',
  id: '',
};

const taskSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTaskList: (state, action: PayloadAction<{ username: string, email: string, id: string }>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
  },
});

export const { setTaskList } = taskSlice.actions;
export default taskSlice.reducer;
