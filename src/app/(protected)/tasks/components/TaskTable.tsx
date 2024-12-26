"use client"

import { useState, useEffect, useMemo, useTransition, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskDetailModal } from "./TaskDetailModal"
import { CreateTaskType, Task } from "@/types/task"
import { Eye, ChevronUp, ChevronDown, Plus, Loader2, ArrowUpDown, BarChart2 } from 'lucide-react'
import { editTask, deleteTask, fetchTaskList, createNewTask } from "./../../../../../actions/taskActions"
import { useToast } from "@/hooks/use-toast"
import { CreateTaskModal } from "./CreateTaskModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "./Spinner"
import { EditTaskModal } from "./EditTaskModal"
import { DateFilterButton } from "./DateFilterButton"
import { ColumnVisibilityToggle } from "./ColumnVisibilityToggle"
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/utils"
// import { ISODateString } from "@/types/ISODateString"
interface TaskTableProps {
  chatMode: 'recommend' | 'set deadline'
}

type SortConfig = {
  key: keyof Task;
  direction: 'asc' | 'desc';
} | null;

type DateFilterField = 'created_at' | 'updated_at' | 'start_time' | 'end_time';

export const TaskTable: React.FC<TaskTableProps> = ({ chatMode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: "end_time", direction: "desc" })
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [dateFilterField, setDateFilterField] = useState<DateFilterField>('start_time')
  const [columns, setColumns] = useState([
    { key: 'select', label: 'Select', isVisible: chatMode === 'set deadline' },
    { key: 'title', label: 'Title', isVisible: true },
    { key: 'description', label: 'Description', isVisible: true },
    { key: 'start_time', label: 'Start Time', isVisible: true },
    { key: 'end_time', label: 'End Time', isVisible: true },
    { key: 'status', label: 'Status', isVisible: true },
    { key: 'priority', label: 'Priority', isVisible: true },
  ])
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const now = new Date();
  const [startDate, setStartDate] = useState<Date | undefined | string>(getFirstDayOfMonth(now));
  const [endDate, setEndDate] = useState<Date | undefined | string>(getLastDayOfMonth(now));


  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchTaskList(startDate, endDate) || []
      setTasks(fetchedTasks)
      setLoading(false)
    } catch (err) {
      console.log(err);
      setError("Failed to fetch data. Please try again later.")
      setLoading(false)
    }
  }, [startDate, endDate])
  const assignStartDate = (date: Date | undefined | string) => {
    setStartDate(date as string);
  };
  const assignEndDate = (date: Date | undefined | string) => {
    setEndDate(date as string);
  };

  useEffect(() => {
    console.log("1");
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    setColumns(prevColumns => prevColumns.map(column => 
      column.key === 'select' ? { ...column, isVisible: chatMode === 'set deadline' } : column
    ))
  }, [chatMode])

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
  
  const getStatusHoverColor = (status: Task['status']): string => {
    switch (status) {
      case 'Todo':
        return 'bg-yellow-700 text-white'
      case 'In Progress':
        return 'bg-blue-700 text-white'
      case 'Completed':
        return 'bg-green-700 text-white'
      case 'Expired':
        return 'bg-red-700 text-white'
      default:
        return 'bg-gray-700 text-white'
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
  
  const getPriorityHoverColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-700 text-white'
      case 'medium':
        return 'bg-yellow-700 text-white'
      case 'low':
        return 'bg-green-700 text-white'
      default:
        return 'bg-gray-700 text-white'
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
    
        if (valueA !== undefined && valueB !== undefined) {
          if (valueA < valueB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
        }
    
        if (valueA === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueB === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
    
        return 0;
      });
    }
    
    return result
  }, [tasks, searchTerm, sortConfig, statusFilter, priorityFilter])

  const handleAddTask = (newTask: CreateTaskType) => {
    startTransition(async () => {
      try {
        await createNewTask(newTask)
        const fetchedTasks = await fetchTaskList(startDate || getFirstDayOfMonth(now), endDate || getLastDayOfMonth(now))
        setTasks(fetchedTasks)
        setIsAddTaskModalOpen(false)
        toast({
          title: "Task added",
          description: "The new task has been successfully added.",
        })
      } catch (error) {
        console.log(error)
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

  const handleAnalyzeTask = (task: Task) => {
    console.log('Analyzing task:', task);
  }

  const handleDateFilterApply = () => {
    // The filtering logic is already handled in the filteredAndSortedTasks memo
  }

  const handleDateFilterClear = () => {
    setDateFilterField('start_time')
    setStartDate(getFirstDayOfMonth(now))
    setEndDate(getLastDayOfMonth(now))
  }

  const handleToggleColumn = (key: string) => {
    setColumns(columns.map(column => 
      column.key === key ? { ...column, isVisible: !column.isVisible } : column
    ))
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTasks(new Set())
    } else {
      const allTaskIds = filteredAndSortedTasks.map(task => task.id)
      setSelectedTasks(new Set(allTaskIds))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectTask = (taskId: string) => {
    const newSelectedTasks = new Set(selectedTasks)
    if (newSelectedTasks.has(taskId)) {
      newSelectedTasks.delete(taskId)
    } else {
      newSelectedTasks.add(taskId)
    }
    setSelectedTasks(newSelectedTasks)
    setSelectAll(newSelectedTasks.size === filteredAndSortedTasks.length)
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="w-full py-0">
      <div className="space-y-4 mb-4">
        <div className="flex flex-row items-center space-x-2 w-full justify-between">
          <Input
            type="text"
            placeholder="Search tasks by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
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
            <SelectContent >
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
        <div className="flex flex-row items-center space-x-2 justify-between">
          <DateFilterButton
            dateFilterField={dateFilterField}
            startDate={startDate as Date}
            endDate={endDate as Date}
            onDateFilterFieldChange={setDateFilterField}
            onStartDateChange={assignStartDate}
            onEndDateChange={assignEndDate}
            onApply={handleDateFilterApply}
            onClear={handleDateFilterClear}
          />
          <div className = "flex flex-row items-center space-x-2">
            <ColumnVisibilityToggle columns={columns} onToggle={handleToggleColumn} />
            <Button onClick={() => setIsAddTaskModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.find(col => col.key === 'select')?.isVisible && (
              <TableHead>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all tasks"
                />
              </TableHead>
            )}
            {columns.filter(column => column.isVisible && column.key !== 'select').map(column => (
              <TableHead 
                key={column.key} 
                className="cursor-pointer"
                onClick={() => handleSort(column.key as keyof Task)}
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
              {columns.find(col => col.key === 'select')?.isVisible && (
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={() => handleSelectTask(task.id)}
                    aria-label={`Select task ${task.title}`}
                  />
                </TableCell>
              )}
              {columns.filter(column => column.isVisible && column.key !== 'select').map(column => (
                <TableCell key={`${task.id}-${column.key}`}>
                  {column.key === 'title' && task.title}
                  {column.key === 'description' && (
                    task?.description?.length as number > 20
                      ? `${task?.description?.substring(0, 20)}...`
                      : (task?.description || '')
                  )}
                  {column.key === 'start_time' && new Date(task.start_time as string).toLocaleString()}
                  {column.key === 'end_time' && new Date(task.end_time as string).toLocaleString()}
                  {column.key === 'status' && (
                    <Badge className={`${getStatusColor(task.status)} hover:${getStatusHoverColor(task.status)}`}>
                      {task.status}
                    </Badge>
                  )}
                  {column.key === 'priority' && (
                    <Badge className={`${getPriorityColor(task.priority)} hover:${getPriorityHoverColor (task.priority)}`}>
                      {task.priority}
                    </Badge>
                  )}
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

export default TaskTable;

