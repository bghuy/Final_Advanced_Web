import React, { Dispatch, SetStateAction, useState } from 'react';
// import { updateTaskEndTime } from '../types';
import  { Task } from '@/types/task';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { updatedTask } from '../../../../../actions/taskActions';
export type SetTasks = Dispatch<SetStateAction<Task[]>>;
interface CalendarProps {
  tasks: Task[];
  setTasks: SetTasks;
}

type ViewMode = 'month' | 'week';

export const Calendar: React.FC<CalendarProps> = ({ tasks, setTasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  function updateTaskEndTime(tasks: Task[], taskId: string, newEndTime: string): Task[] {
    const now = new Date();
    const currentTask = tasks.find(task => task.id === taskId);
    return tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            end_time: newEndTime,
            status: new Date(newEndTime) < now
              ? 'expired'
              : (currentTask?.status === 'expired' ? 'to do' : currentTask?.status) as 'expired' | 'to do' | 'in progress' | 'completed'
          }
        : task
    );
  }  const changeDate = (increment: number) => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + increment * 7);
      setCurrentDate(newDate);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const destinationId = result.destination.droppableId;
    const taskId = result.draggableId;

    setTasks(prevTasks => {
      const existingTask = prevTasks.find(task => task.id === taskId);
      const updatedTasks = updateTaskEndTime(prevTasks, taskId, destinationId);
      // console.log('Updated tasks:', updatedTasks);
      const task = updatedTasks.find(task => task.id === taskId);
      if (existingTask?.end_time !== task?.end_time && task) {
        updatedTask({...task, status: task?.status});
      }
      return updatedTasks;
    });    // const task = tasks.find(task => task.id === taskId);
    // console.log('Task:', task);
    
  };

  const getWeekStartDate = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  };

  const years = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-6xl mx-auto bg-card rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Select
            value={currentDate.getFullYear().toString()}
            onValueChange={(value) => setCurrentDate(new Date(parseInt(value), currentDate.getMonth(), 1))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentDate.getMonth().toString()}
            onValueChange={(value) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(value), 1))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => changeDate(-1)} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-primary">
            {viewMode === 'month'
              ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
              : `Week of ${getWeekStartDate(currentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </h2>
          <Button onClick={() => changeDate(1)} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={viewMode}
          onValueChange={(value: ViewMode) => setViewMode(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DragDropContext onDragEnd={onDragEnd} >
        {viewMode === 'month' ? (
          <MonthView currentDate={currentDate} tasks={tasks} />
        ) : (
          <WeekView startDate={getWeekStartDate(currentDate)} tasks={tasks} />
        )}
      </DragDropContext>
    </div>
  );
};

