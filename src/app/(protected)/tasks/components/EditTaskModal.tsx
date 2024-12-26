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

  useEffect(() => {
    if (task) {
      reset({
        ...task,
        start_time: task.start_time?.slice(0, 16) || '',
        end_time: task.end_time?.slice(0, 16) || '',
      })
    }
  }, [task, reset])

  const onSubmit = (data: Task) => {
    if (task) {
      // if (data.status === 'Todo' && !data.deadline) {
      //   delete data.deadline;
      // }
      onUpdateTask({ ...task, ...data, updated_at: new Date().toISOString() })
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
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
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
              />
            </div>
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-end_time" className="text-right">
              End Time
            </Label>
            <div className="col-span-3">
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => <Input {...field} id="edit-end_time" type="datetime-local" />}
              />
            </div>
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-end_time" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3">
              <Controller
                name="end_time"
                control={control}
                rules={{ required: status !== 'Todo' ? "Deadline is required" : false }}
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

