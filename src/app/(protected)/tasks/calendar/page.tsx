'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar/Navbar";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Task } from "@/types/task";
import { getTasks, editTask, deleteTask } from "../../../../../actions/taskActions";
import { TaskDetailModal } from "@/app/(protected)/tasks/components/TaskDetailModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import Link from 'next/link';
import { EditTaskModal } from "@/app/(protected)/tasks/components/EditTaskModal";
import { useTransition } from 'react';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface CalendarTask extends Task {
  start: Date;
  end: Date;
}

export default function CalendarView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tasks.",
          variant: "destructive",
        });
      }
    };

    fetchTasks();
  }, [toast]);

  const handleEventDrop = async ({ event, start, end }: any) => {
    const task = event as Task;
    const newStart = moment(start);
    const now = moment();
    
    let newStatus = task.status;
    if (newStart.isBefore(now, 'day')) {
      newStatus = 'Expired';
    } else if (task.status === 'Expired') {
      newStatus = 'Todo';
    }

    startTransition(async () => {
      try {
        const updatedTask = await editTask({
          ...task,
          deadline: start.toISOString(),
          status: newStatus,
        });
        
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        
        toast({
          title: "Task updated",
          description: "Task has been rescheduled successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update task schedule.",
          variant: "destructive",
        });
      }
    });
  };

  const handleSelectEvent = (event: CalendarTask) => {
    const task = {
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      priority: event.priority,
      deadline: event.deadline,
      created_at: event.created_at,
      updated_at: event.updated_at
    };
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    startTransition(async () => {
      try {
        const result = await editTask(updatedTask);
        setTasks(tasks.map(t => t.id === result.id ? result : t));
        setIsEditModalOpen(false);
        toast({
          title: "Task updated",
          description: "The task has been successfully updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update the task.",
          variant: "destructive",
        });
      }
    });
  };

  const handleOpenEditModal = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = async (taskToDelete: Task) => {
    startTransition(async () => {
      try {
        await deleteTask(taskToDelete.id);
        setTasks(tasks.filter(t => t.id !== taskToDelete.id));
        setIsDetailModalOpen(false);
        toast({
          title: "Task deleted",
          description: "The task has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the task.",
          variant: "destructive",
        });
      }
    });
  };

  const eventStyleGetter = (event: CalendarTask) => {
    let backgroundColor = '#3B82F6'; // blue for default

    switch (event.status) {
      case 'Todo':
        backgroundColor = '#EAB308'; // yellow
        break;
      case 'In Progress':
        backgroundColor = '#3B82F6'; // blue
        break;
      case 'Completed':
        backgroundColor = '#22C55E'; // green
        break;
      case 'Expired':
        backgroundColor = '#EF4444'; // red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-10 px-2">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Calendar View</h1>
          <Link href="/tasks">
            <Button variant="outline" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Table View
            </Button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <DnDCalendar
            localizer={localizer}
            events={tasks.map(task => ({
              ...task,
              start: new Date(task.deadline),
              end: moment(task.deadline).add(1, 'hours').toDate(),
              allDay: false
            }))}
            defaultView="month"
            views={['month', 'week', 'day']}
            startAccessor={(event: any) => event.start}
            endAccessor={(event: any) => event.end}
            style={{ height: 'calc(100vh - 250px)' }}
            onEventDrop={handleEventDrop}
            onSelectEvent={(event: any) => handleSelectEvent(event as CalendarTask)}
            eventPropGetter={(event: any) => eventStyleGetter(event as CalendarTask)}
            draggableAccessor={() => true}
            resizable={false}
            popup
            selectable
          />
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenEditModal={handleOpenEditModal}
        onDelete={handleDeleteTask}
        isLoading={isPending}
      />

      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateTask={handleUpdateTask}
        isLoading={isPending}
      />
    </div>
  );
} 