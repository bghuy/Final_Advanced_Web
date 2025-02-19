
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Task } from "@/types/task"
import { Edit, Trash2, Loader2, Clock } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface TaskDetailModalProps {
  task: (Task & { created_at?: string, updated_at?: string }) | null;
  hideAllActions?: boolean
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isLoading?: boolean;
  onOpenEditModal?: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onEdit, onDelete, hideAllActions, isLoading = false, onOpenEditModal }: TaskDetailModalProps) {
  //const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()
  if (!task) return null;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'to do':
        return 'bg-yellow-500'
      case 'in progress':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'expired':
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{task.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="text-right font-bold">Description</Label>
            <p className="text-sm text-gray-500">{task.description}</p>
          </div>
          <div>
            <Label className="text-right font-bold">Start Time</Label>
            <p className="text-sm text-gray-500">{new Date(task.start_time as string).toLocaleString()}</p>
          </div>
          {/* <div>
            <Label className="text-right font-bold">End Time</Label>
            <p className="text-sm text-gray-500">{new Date(task.end_time as string).toLocaleString()}</p>
          </div> */}
          <div>
            <Label className="text-right font-bold mr-1">Status</Label>
            <Badge className={`${getStatusColor(task.status)} text-white`}>
              {task.status}
            </Badge>
          </div>
          <div>
            <Label className="text-right font-bold mr-1">Priority</Label>
            <Badge className={`${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </Badge>
          </div>
          {task.created_at && 
            <div>
              <Label className="text-right font-bold">Created</Label>
              <p className="text-sm text-gray-500">{new Date(task.created_at).toLocaleString()}</p>
            </div>
          }
          {task.updated_at && 
            <div>
              <Label className="text-right font-bold">Last Updated</Label>
              <p className="text-sm text-gray-500">{new Date(task.updated_at).toLocaleString()}</p>
            </div>
          }
          <div>
            <Label className="text-right font-bold">End time</Label>
            <p className="text-sm text-gray-500">{new Date(task.end_time as string).toLocaleString()}</p>
          </div>
        </div>
        {!hideAllActions &&
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              router.push(`/focus-timer/${task.id}`)
            }}>
              <Clock className="mr-2 h-4 w-4" />
                Focus Timer
            </Button>
            {onEdit && onOpenEditModal && (
              <Button variant="outline" onClick={() => {
                onClose();
                onOpenEditModal();
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
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
            )}
          </div>
        }
      </DialogContent>
    </Dialog>
  )
}

