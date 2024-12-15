import { useState, useEffect } from 'react'
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
  const [editedTask, setEditedTask] = useState<Task | null>(task)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  if (!editedTask) return null

  const handleUpdateTask = () => {
    if (editedTask) {
      onUpdateTask(editedTask)
      onClose()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTask(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedTask(prev => prev ? { ...prev, [name]: value } : null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px] h-full overflow-y-auto data-[state=open]:animate-none data-[state=open]:duration-0 data-[state=close]:transition-all sm:rounded-none" 
        position='right' 
        forceMount
      >
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Title
            </Label>
            <Input
              id="edit-title"
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="edit-description"
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              className="col-span-3"
              rows={5}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-deadline" className="text-right">
              Deadline
            </Label>
            <Input
              id="edit-deadline"
              name="deadline"
              type="date"
              value={editedTask.deadline}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-status" className="text-right">
              Status
            </Label>
            <Select
              value={editedTask.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-priority" className="text-right">
              Priority
            </Label>
            <Select
              value={editedTask.priority}
              onValueChange={(value) => handleSelectChange('priority', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateTask} disabled={isLoading}>
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
      </DialogContent>
    </Dialog>
  )
}

