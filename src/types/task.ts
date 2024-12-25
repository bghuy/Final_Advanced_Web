export interface Task {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  deadline?: string;
  status: 'Todo' | 'In Progress' | 'Completed' | 'Expired';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

export type CreateTaskType = {
  description?: string,
  end_time?: string,
  priority: 'high' | 'medium' | 'low';
  start_time?: string,
  status: 'Todo' | 'In Progress' | 'Completed' | 'Expired';
  title: string,
  deadline?: string,
}

