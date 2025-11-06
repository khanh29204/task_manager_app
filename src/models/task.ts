export interface Task {
  id: string;
  title: string;
  fullname: string;
  gender: Gender;
  cv_path?: string;
  avatar?: string;
  document_path?: string;
  major: string;
  position: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface TasksReponse {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}
