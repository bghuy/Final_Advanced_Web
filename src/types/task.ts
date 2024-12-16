export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Todo' | 'In Progress' | 'Completed' | 'Expired';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
  focusSessions?: number;
}

