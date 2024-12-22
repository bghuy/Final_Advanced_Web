"use client"

import { useState, useEffect, useMemo, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TaskDetailModal } from "./TaskDetailModal"
import { Task } from "@/types/task"
import { Eye, ChevronUp, ChevronDown, Plus, Loader2, ArrowUpDown, Bot, BarChart2 } from 'lucide-react'
import { getTasks, editTask, deleteTask, createTask } from "../../../../../actions/taskActions"
import { useToast } from "@/hooks/use-toast"
import { ColumnVisibilityToggle } from "./ColumnVisibilityToggle"
import { CreateTaskModal } from "./CreateTaskModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "./Spinner"
import { EditTaskModal } from "./EditTaskModal"
import Link from "next/link"

type SortConfig = {
  key: keyof Task;
  direction: 'asc' | 'desc';
} | null;

type ColumnConfig = {
  key: string;
  label: string;
  isVisible: boolean;
};

export function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'title', label: 'Title', isVisible: true },
    { key: 'description', label: 'Description', isVisible: true },
    { key: 'deadline', label: 'Deadline', isVisible: true },
    { key: 'status', label: 'Status', isVisible: true },
    { key: 'priority', label: 'Priority', isVisible: true },
    { key: 'created_at', label: 'Created At', isVisible: true },
    { key: 'updated_at', label: 'Updated At', isVisible: true },
  ] as ColumnConfig[])

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks)
        setLoading(false)
      } catch (err) {
        console.log(err);
        setError("Failed to fetch data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewDetail = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = () => {
    setIsModalOpen(false)
    setIsEditModalOpen(true)
  }

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'Todo':
        return 'bg-yellow-500 text-white'
      case 'In Progress':
        return 'bg-blue-500 text-white'
      case 'Completed':
        return 'bg-green-500 text-white'
      case 'Expired':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleSort = (key: keyof Task) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === key) {
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null;
      }
      return { key, direction: 'asc' };
    })
  }

  const filteredAndSortedTasks = useMemo(() => {
    const result = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || task.status === statusFilter) &&
      (priorityFilter === 'all' || task.priority === priorityFilter)
    )

    if (sortConfig && sortConfig.key && sortConfig.direction) {
      const key = sortConfig.key;
      result.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];
    
        // Kiểm tra giá trị không phải là undefined trước khi so sánh
        if (valueA !== undefined && valueB !== undefined) {
          if (valueA < valueB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
        }
    
        // Trường hợp giá trị undefined được xem là nhỏ nhất
        if (valueA === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueB === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
    
        return 0;
      });
    }
    
    
    

    return result
  }, [tasks, searchTerm, sortConfig, statusFilter, priorityFilter])

  const handleAddTask = (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'focusSessions'>) => {
    startTransition(async () => {
      try {
        const createdTask = await createTask(newTask)
        setTasks(prevTasks => [...prevTasks, createdTask])
        setIsAddTaskModalOpen(false)
        toast({
          title: "Task added",
          description: "The new task has been successfully added.",
        })
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to add the task. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    startTransition(async () => {
      try {
        const result = await editTask(updatedTask)
        setTasks(prevTasks => prevTasks.map(task => task.id === result.id ? result : task))
        setIsEditModalOpen(false)
        toast({
          title: "Task updated",
          description: "The task has been successfully updated.",
        })
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to update the task. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleDeleteTask = async (taskId: string) => {
    startTransition(async () => {
      try {
        await deleteTask(taskId)
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        setIsModalOpen(false)
        toast({
          title: "Task deleted",
          description: "The task has been successfully deleted.",
        })
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to delete the task. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleToggleColumn = (key: string) => {
  setColumns((prevColumns) =>
    prevColumns.map((column) =>
      column.key === key ? { ...column, isVisible: !column.isVisible } : column
    )
  );
};

  const handleAnalyzeTask = (task: Task) => {
    // Implement task analysis logic here
    console.log('Analyzing task:', task);
    // You can open a modal or navigate to a new page for task analysis
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search tasks by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Task['status'] | 'all')}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Todo">Todo</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Task['priority'] | 'all')}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <ColumnVisibilityToggle columns={columns} onToggle={handleToggleColumn} />
          <Button onClick={() => setIsAddTaskModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>
      <div className="ms-auto mb-4">
        <Link href="/ai-recommend">
          <Button variant="outline">
            <Bot className="mr-2 h-4 w-4" /> AI Recommendations
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => column.isVisible && (
              <TableHead 
                key={column.key} 
                onClick={() => handleSort(column.key as keyof Task)} 
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  {column.label}
                  {sortConfig?.key === column.key ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedTasks.map((task) => (
            <TableRow key={task.id}>
              {columns.map(column => column.isVisible && (
                <TableCell key={`${task.id}-${column.key}`}>
                  {column.key === 'title' && task.title}
                  {column.key === 'description' && (
                    task.description.length > 20
                      ? `${task.description.substring(0, 20)}...`
                      : task.description
                  )}
                  {column.key === 'deadline' && new Date(task.deadline).toLocaleDateString()}
                  {column.key === 'status' && (
                    <Badge className={`${getStatusColor(task.status)}`}>
                      {task.status}
                    </Badge>
                  )}
                  {column.key === 'priority' && (
                    <Badge className={`${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  )}
                  {column.key === 'created_at' && new Date(task.created_at).toLocaleString()}
                  {column.key === 'updated_at' && new Date(task.updated_at).toLocaleString()}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(task)}
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                    View Detail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyzeTask(task)}
                    disabled={isPending}
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Analyze
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleUpdateTask}
        onDelete={handleDeleteTask}
        isLoading={isPending}
        onOpenEditModal={handleOpenEditModal}
      />
      <CreateTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onCreateTask={handleAddTask}
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
  )
}

