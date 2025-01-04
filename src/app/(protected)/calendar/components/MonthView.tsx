import React from 'react';
import { Task } from '@/types/task';
import { Day } from './Day';
import { getDaysInMonth } from '@/utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, tasks }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const totalDays = 42; // 6 weeks * 7 days

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (task.end_time) {
        const taskEndTime = new Date(task.end_time);
        return taskEndTime.getFullYear() === date.getFullYear() &&
               taskEndTime.getMonth() === date.getMonth() &&
               taskEndTime.getDate() === date.getDate();
      }
      return false;
    });
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="font-semibold text-center text-sm py-2 text-muted-foreground">
          {day}
        </div>
      ))}
      {Array.from({ length: totalDays }).map((_, index) => {
        const dayNumber = index - firstDayOfMonth + 1;
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();

        if (isCurrentMonth) {
          return (
            <Day
              key={date.toString()}
              date={date}
              tasks={getTasksForDate(date)}
              droppableId={date.toISOString()}
            />
          );
        } else {
          return <div key={index} className="h-24 bg-muted/20" />;
        }
      })}
    </div>
  );
};

export default MonthView;

