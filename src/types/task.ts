export interface Task {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  status: 'to do' | 'in progress' | 'completed' | 'expired';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}
export type CreateTaskType = {
  description?: string,
  end_time?: string,
  priority: 'high' | 'medium' | 'low';
  start_time?: string,
  status: 'to do' | 'in progress' | 'completed' | 'expired';
  title: string,
}

