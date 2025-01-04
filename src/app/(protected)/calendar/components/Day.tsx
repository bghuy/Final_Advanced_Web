import React from 'react';
import { Task } from '@/types/task'; 
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface DayProps {
  date: Date;
  tasks: Task[];
  droppableId: string;
}

export const Day: React.FC<DayProps> = ({ date, tasks, droppableId }) => {
  const isToday = new Date().toDateString() === date.toDateString();

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
                  <div className="font-semibold truncate">{task.title}</div>
                  <div className="text-[10px] capitalize">{task.priority}</div>
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

