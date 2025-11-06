import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchTasksAPI} from '../api/task.api';
import {showNotification} from '../slice/notification.slice';
import * as taskApi from '../api/task.api';
import {Gender, Task} from '../../models/task';
import {
  optimisticToggleComplete,
  revertToggleComplete,
} from '../slice/task.slice';
import {saveFileToCache} from '../../utils/fileViewer';

export const uploadFile = createAsyncThunk(
  'task/uploadFile',
  async (formData: FormData, {rejectWithValue, dispatch}) => {
    try {
      const response = await taskApi.uploadFileAPI(formData);
      saveFileToCache(response.url);
      return response.url;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(
        showNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return rejectWithValue(errorMessage || 'File upload failed');
    }
  },
);

interface FetchTasksParams {
  page: number;
  limit: number;
  search?: string;
  gender?: Gender;
  is_complete?: boolean;
}

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (
    {page, limit, search, gender, is_complete}: FetchTasksParams,
    {dispatch},
  ) => {
    try {
      const response = await fetchTasksAPI(
        page,
        limit,
        search,
        gender,
        is_complete,
      );
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(
        showNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData: Omit<Task, 'id'>, {rejectWithValue, dispatch}) => {
    try {
      return await taskApi.createTaskAPI(taskData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(
        showNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return rejectWithValue(error.message);
    }
  },
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async (
    taskData: Partial<Task> & {id: string},
    {rejectWithValue, dispatch},
  ) => {
    try {
      return await taskApi.updateTaskAPI(taskData.id, taskData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(
        showNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return rejectWithValue(error.message);
    }
  },
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (id: string, {rejectWithValue, dispatch}) => {
    try {
      await taskApi.deleteTaskAPI(id);
      dispatch(
        showNotification({
          message: 'Task deleted successfully',
          type: 'success',
        }),
      );
      return {id};
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(
        showNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      return rejectWithValue(error.message);
    }
  },
);

export const toggleCompleteTask = createAsyncThunk(
  'task/toggleCompleteTask',
  async (task: Task, {dispatch, rejectWithValue}) => {
    // Dispatch một action đồng bộ để thay đổi UI ngay
    dispatch(optimisticToggleComplete(task.id));

    try {
      // Sử dụng lại API của updateTask hoặc một endpoint /complete riêng
      const response = await taskApi.updateTaskAPI(task.id, {
        is_complete: !task.is_complete,
      });
      return response; // Trả về task đã được cập nhật từ server
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(
        showNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
      dispatch(revertToggleComplete(task.id));
      return rejectWithValue(error.message);
    }
  },
);
