import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types/task';
interface TaskState {
  tasks: Task[];
  selectedTaskIds: string[];
}


const initialState: TaskState = {
  tasks: [],
  selectedTaskIds: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTaskList: (state, action: PayloadAction<{ tasks: Task[] }>) => {
      state.tasks = action.payload.tasks;
    },
    setSelectedTaskIds: (state, action: PayloadAction<string[]>) => {
      state.selectedTaskIds = action.payload;
    },
    addSelectedTaskId: (state, action: PayloadAction<string>) => {
      state.selectedTaskIds.push(action.payload);
    },
    removeSelectedTaskId: (state, action: PayloadAction<string>) => {
      state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== action.payload);
    },
    clearSelectedTaskIds: (state) => {
      state.selectedTaskIds = [];
    }
  },
});

export const { setTaskList, addSelectedTaskId,removeSelectedTaskId, clearSelectedTaskIds, setSelectedTaskIds   } = taskSlice.actions;
export default taskSlice.reducer;
