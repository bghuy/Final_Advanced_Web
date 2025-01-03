
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { CreateTaskType} from "@/types/task"
import { Loader2 } from 'lucide-react'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (newTask: CreateTaskType) => void
  isLoading: boolean
}

// type FormData = Omit<Task, 'id' | 'created_at' | 'updated_at'>

export function CreateTaskModal({ isOpen, onClose, onCreateTask, isLoading }: CreateTaskModalProps) {
  const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm<CreateTaskType>({
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      status: 'to do',
      priority: 'medium',
    },
    mode: 'onChange'
  })

  const start_time = watch('start_time')

  const onSubmit = (data: CreateTaskType) => {
    const convertToISODateString = (date: string | undefined) => {
      if (date) {
        const isoDate = new Date(date).toISOString();
        return isoDate;
      }
      return undefined;
    }
  
    data.start_time = convertToISODateString(data.start_time);
    data.end_time = convertToISODateString(data.end_time);
    onCreateTask(data);
    reset();
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Fill in the details to create a new task.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <div className="col-span-3">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => <Input {...field} id="title" />}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Textarea {...field} id="description" className="col-span-3" rows={5} />}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
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
                      <SelectItem value="to do">Todo</SelectItem>
                      <SelectItem value="in progress">in progress</SelectItem>
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
            <Label htmlFor="start_time" className="text-right">
              Start Time
            </Label>
            <div className="col-span-3">
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => <Input {...field} id="start_time" type="datetime-local" />}
                rules={{
                  required: "Start time is required",
                  validate: (value) => {
                    if (!value) return "Start time is required";
                    const selectedDate = new Date(value);
                    const now = new Date();
                    return selectedDate >= now || "Start time must be greater than or equal to the current date and time";
                  },
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_time" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3">
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => <Input {...field} id="end_time" type="datetime-local" />}
                rules={{
                  required: "Deadline is required",
                  validate: (value) => 
                    !start_time || !value || new Date(value) >= new Date(start_time) || 
                    "End time must be later than or equal to start time"
                }}
              />
            </div>
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_time" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3">
              <Controller
                name="end_time"
                control={control}
                rules={{ required: status !== 'to do' ? "Deadline is required" : false }}
                render={({ field }) => <Input {...field} id="end_time" type="datetime-local" />}
              />
              {errors.end_time && <p className="text-sm text-red-500 mt-1">{errors.end_time.message}</p>}
            </div>
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
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
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

