
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Task } from "@/types/task"
import { Edit, Trash2, Loader2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isLoading: boolean;
  onOpenEditModal: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onDelete, isLoading, onOpenEditModal }: TaskDetailModalProps) {
  //const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!task) return null;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Todo':
        return 'bg-yellow-500'
      case 'In Progress':
        return 'bg-blue-500'
      case 'Completed':
        return 'bg-green-500'
      case 'Expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-full data-[state=open]:rounded-none overflow-y-auto" position="right">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{task.title}</DialogTitle>
          <DialogDescription>View task details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="text-right font-bold">Description</Label>
            <p className="text-sm text-gray-500">{task.description}</p>
          </div>
          <div>
            <Label className="text-right font-bold">Deadline</Label>
            <p className="text-sm text-gray-500">{new Date(task.deadline).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-right font-bold">Status</Label>
            <Badge className={`${getStatusColor(task.status)} text-white`}>
              {task.status}
            </Badge>
          </div>
          <div>
            <Label className="text-right font-bold">Priority</Label>
            <Badge className={`${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </Badge>
          </div>
          <div>
            <Label className="text-right font-bold">Created At</Label>
            <p className="text-sm text-gray-500">{new Date(task.created_at).toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-right font-bold">Updated At</Label>
            <p className="text-sm text-gray-500">{new Date(task.updated_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => {
            onClose();
            onOpenEditModal();
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(task.id)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

