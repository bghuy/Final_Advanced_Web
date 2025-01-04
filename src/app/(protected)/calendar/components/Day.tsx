import React from 'react';
import { Task } from '@/types/task'; 
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge } from '@/components/ui/badge'
interface DayProps {
  date: Date;
  tasks: Task[];
  droppableId: string;
}

export const Day: React.FC<DayProps> = ({ date, tasks, droppableId }) => {
  const isToday = new Date().toDateString() === date.toDateString();
  const getBadgeClassName = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'to do':
        return 'bg-yellow-500'
      case 'in progress':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  return (
    <Droppable droppableId={droppableId} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={true}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`border rounded-lg p-1 h-24 overflow-y-auto bg-background shadow-sm ${
            isToday ? 'ring-2 ring-primary' : ''
          }`}
        >
          <div className={`text-right text-sm mb-1 ${isToday ? 'font-bold' : ''}`}>
            {date.getDate()}
          </div>
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`text-xs p-1 mb-1 rounded-md shadow-sm transition-colors ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}
                >
                  <div className="font-semibold truncate mb-2">{task.title}</div>
                  <div className='flex flex-col gap-y-2 w-fit'>
                    <Badge className={getBadgeClassName(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

