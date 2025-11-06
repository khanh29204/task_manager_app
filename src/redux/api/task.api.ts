import {instance} from '../../utils/axios_instance';
import {Task, TasksReponse} from '../../models/task';

// Lấy danh sách tasks
export const fetchTasksAPI = async (
  page: number,
  limit: number,
  search?: string,
  gender?: string,
  is_complete?: boolean,
): Promise<TasksReponse> => {
  const response = await instance.get('/api/tasks', {
    params: {page, limit, search, gender, is_complete},
  });
  return response.data;
};

export const createTaskAPI = async (
  taskData: Omit<Task, 'id'>,
): Promise<Task> => {
  const response = await instance.post('/api/tasks', taskData);
  return response.data;
};

export const updateTaskAPI = async (
  id: string,
  taskData: Partial<Task>,
): Promise<Task> => {
  const response = await instance.put(`/api/tasks/${id}`, taskData);
  return response.data;
};

export const uploadFileAPI = async (
  formData: FormData,
): Promise<{url: string}> => {
  const response = await instance.post('/api/tasks/upload', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
  return response.data;
};

export const deleteTaskAPI = async (id: string): Promise<{id: string}> => {
  await instance.delete(`/api/tasks/${id}`);
  return {id};
};
