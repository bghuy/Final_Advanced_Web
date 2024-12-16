import { Task } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEditModal: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  isLoading: boolean;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onOpenEditModal,
  onEdit,
  onDelete,
  isLoading
}: TaskDetailModalProps) {
  if (!task) return null;

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'Todo':
        return 'bg-yellow-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-gray-500">{task.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Deadline</h4>
            <p className="text-sm text-gray-500">
              {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Status</h4>
            <Badge className={`${getStatusColor(task.status)} text-white`}>
              {task.status}
            </Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium">Priority</h4>
            <Badge className={`${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </Badge>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenEditModal}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => task && onDelete(task)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

