import { Event } from 'react-big-calendar';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Completed' | 'Expired';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent extends Event, Task {
  title: string;
}

