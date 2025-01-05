import React, { useState } from 'react';
import { Task } from '@/types/task';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskDetailModal } from '../../tasks/components/TaskDetailModal';
import { format, isSameDay } from 'date-fns';

interface WeekViewProps {
  startDate: Date;
  tasks: Task[];
}

const WeekView: React.FC<WeekViewProps> = ({ startDate, tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (task.end_time) {
        const taskEndTime = new Date(task.end_time);
        return isSameDay(taskEndTime, day);
      }
      return false;
    });
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'to do':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day) => (
        <div key={day.toISOString()} className="flex flex-col">
          <div className="text-center font-semibold text-sm py-2 bg-primary/10 rounded-t-lg">
            <div>{format(day, 'EEE')}</div>
            <div className="text-muted-foreground">{format(day, 'd')}</div>
          </div>
          <Droppable droppableId={day.toISOString()} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={true}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 p-2 rounded-b-lg min-h-[600px] ${
                  snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-background'
                }`}
              >
                {getTasksForDay(day).map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => {
                          setSelectedTask(task);
                          setIsModalOpen(true);
                        }}
                        className={`mb-2 p-2 rounded-md shadow-sm ${getStatusColor(task.status)} ${
                          snapshot.isDragging ? 'opacity-70' : ''
                        }`}
                      >
                        <div className="font-semibold text-sm truncate">{task.title}</div>
                        {task.start_time && task.end_time && (
                          <div className="text-xs mt-1">
                            {format(new Date(task.start_time), 'HH:mm')} - {format(new Date(task.end_time), 'HH:mm')}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default WeekView;

