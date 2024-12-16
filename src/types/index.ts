import { Event } from 'react-big-calendar';
import { Task } from './task';

export interface CalendarEvent extends Event {
  id: string;
  title: string;
  status: Task['status'];
  priority: Task['priority'];
  description: string;
}

export type { Task } from './task'; 