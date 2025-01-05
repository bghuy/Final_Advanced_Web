import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Task } from "@/types/task"
import { Loader2 } from 'lucide-react'

interface EditTaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdateTask: (task: Task) => void
  isLoading: boolean
}

export function EditTaskModal({ task, isOpen, onClose, onUpdateTask, isLoading }: EditTaskModalProps) {
  const { control, handleSubmit, reset, watch, formState: { errors, isValid } } = useForm<Task>({
    defaultValues: task || {},
    mode: 'onChange'
  })

  const status = watch('status')
  const start_time = watch('start_time')
  const end_time = watch('end_time')

  const validateTimeRange = (start: string, end: string) => {
    const currentTime = new Date()
    const startTime = new Date(start)
    const endTime = new Date(end)
    return currentTime >= startTime && currentTime <= endTime
  }

  useEffect(() => {
    if (task) {
      reset({
        ...task,
        start_time: formatDateForInput(task.start_time),
        end_time: formatDateForInput(task.end_time),
      })
    }
  }, [task, reset])

  const onSubmit = (data: Task) => {
    if (task) {
      onUpdateTask({ 
        ...task, 
        ...data, 
        start_time: formatDateForServer(data.start_time),
        end_time: formatDateForServer(data.end_time),
        updated_at: new Date().toISOString() 
      })
    }
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Title
            </Label>
            <div className="col-span-3">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => <Input {...field} id="edit-title" />}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Textarea {...field} id="edit-description" className="col-span-3" rows={5} />}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Controller
                name="status"
                control={control}
                rules={{ 
                  required: "Status is required",
                  validate: (value) => {
                    if (value === 'to do' && (!start_time || !end_time)) {
                      return "Start time and End time are required for 'To Do' status"
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to do">Todo</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-start_time" className="text-right">
              Start Time
            </Label>
            <div className="col-span-3">
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => <Input {...field} id="edit-start_time" type="datetime-local" />}
                rules={{
                  required: status === 'to do' ? "Start time is required for 'To Do' status" : false,
                  validate: (value) => {
                    if (status === 'to do' && end_time && value && !validateTimeRange(value, end_time)) {
                      return "Current time must be between Start time and End time for 'To Do' status"
                    }
                    return true
                  }                
                }}
              />
              {errors.start_time && <p className="text-sm text-red-500 mt-1">{errors.start_time.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-end_time" className="text-right">
              End time
            </Label>
            <div className="col-span-3">
              <Controller
                name="end_time"
                control={control}
                rules={{
                  required: status === 'to do' ? "End time is required for 'To Do' status" : false,
                  validate: (value) => {
                    if (!start_time || !value || new Date(value) <= new Date(start_time)) {
                      return "End time must be later than start time"
                    }
                    if (status === 'to do' && start_time && !validateTimeRange(start_time, value)) {
                      return "Current time must be between Start time and End time for 'To Do' status"
                    }
                    return true
                  }
                }}
                render={({ field }) => <Input {...field} id="edit-end_time" type="datetime-local" />}
              />
              {errors.end_time && <p className="text-sm text-red-500 mt-1">{errors.end_time.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-priority" className="text-right">
              Priority
            </Label>
            <div className="col-span-3">
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatDateForInput(dateString: string | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

function formatDateForServer(dateString: string | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString()
}

