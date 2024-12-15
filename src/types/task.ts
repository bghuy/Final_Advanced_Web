export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in progress' | 'done' | 'missed';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

