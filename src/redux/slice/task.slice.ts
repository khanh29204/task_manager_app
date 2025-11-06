import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Task, TasksReponse} from '../../models/task';
import {
  fetchTasks,
  updateTask,
  deleteTask,
  uploadFile,
  createTask,
} from '../action/task.action';

interface TaskState {
  tasks: {[taskId: string]: Task};
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

const initialState: TaskState = {
  tasks: {},
  status: 'idle',
  currentPage: 0,
  totalPages: 0,
  totalTasks: 0,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    optimisticToggleComplete: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (state.tasks[taskId]) {
        state.tasks[taskId].is_complete = !state.tasks[taskId].is_complete;
      }
    },
    revertToggleComplete: (state, action: PayloadAction<string>) => {
      // Hoàn tác lại nếu API lỗi
      const taskId = action.payload;
      if (state.tasks[taskId]) {
        state.tasks[taskId].is_complete = !state.tasks[taskId].is_complete;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<TasksReponse>) => {
          state.status = 'succeeded';
          action.payload.tasks.forEach(task => {
            const taskId = (task as any)._id || task.id;
            state.tasks[taskId] = {...task, id: taskId};
          });
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalTasks = action.payload.totalTasks;
        },
      )

      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const newTask = action.payload;
        const taskId = (newTask as any)._id || newTask.id;
        state.tasks[taskId] = {...newTask, id: taskId};
        state.status = 'succeeded';
      })
      // Xử lý updateTask
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const updatedTask = action.payload;
        const taskId = (updatedTask as any)._id || updatedTask.id;
        state.tasks[taskId] = {...updatedTask, id: taskId};
        state.status = 'succeeded';
      })
      // Xử lý deleteTask
      .addCase(
        deleteTask.fulfilled,
        (state, action: PayloadAction<{id: string}>) => {
          delete state.tasks[action.payload.id];
        },
      )
      // Trạng thái upload file không thay đổi state toàn cục, nó được xử lý ở component
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = 'failed';
        console.error('File upload failed:', action.payload);
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('File uploaded successfully:', action.payload);
      })
      .addMatcher(
        action =>
          action.type.startsWith('task/') && action.type.endsWith('/pending'),
        state => {
          state.status = 'loading';
        },
      )
      .addMatcher(
        action =>
          action.type.startsWith('task/') && action.type.endsWith('/rejected'),
        state => {
          state.status = 'failed';
        },
      );
  },
});
export const {optimisticToggleComplete, revertToggleComplete} =
  taskSlice.actions;

export const taskReducer = taskSlice.reducer;
