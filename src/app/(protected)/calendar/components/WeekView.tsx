import React from 'react';
import { Task } from '@/types/task';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface WeekViewProps {
  startDate: Date;
  tasks: Task[];
}

const WeekView: React.FC<WeekViewProps> = ({ startDate, tasks }) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const isSameHour = (date1: Date, date2: string) => {
    const d2 = new Date(date2);
    return date1.getUTCFullYear() === d2.getUTCFullYear() &&
           date1.getUTCMonth() === d2.getUTCMonth() &&
           date1.getUTCDate() === d2.getUTCDate() &&
           date1.getUTCHours() === d2.getUTCHours();
  };

  return (
    <div className="grid grid-cols-8 gap-1">
      <div className="col-span-1"></div>
      {weekDays.map((day) => (
        <div key={day.toISOString()} className="text-center font-semibold text-sm py-2">
          <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
          <div className="text-muted-foreground">{day.getDate()}</div>
        </div>
      ))}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <div className="text-right pr-2 text-sm text-muted-foreground">{hour.toString().padStart(2, '0')}:00</div>
          {weekDays.map((day) => {
            const cellDate = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour));
            const droppableId = cellDate.toISOString();
            return (
              <Droppable key={droppableId} droppableId={droppableId} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={true}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`border min-h-[40px] ${snapshot.isDraggingOver ? 'bg-primary/10' : ''}`}
                  >
                    {tasks
                      .filter(task => task.end_time && isSameHour(cellDate, task.end_time))
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`text-xs p-1 mb-1 rounded-md shadow-sm ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              } ${snapshot.isDragging ? 'opacity-70' : ''}`}
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
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeekView;

