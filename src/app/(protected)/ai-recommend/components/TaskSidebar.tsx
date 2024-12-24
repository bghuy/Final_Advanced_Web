import Link from 'next/link'
import { Task } from '@/types/task'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TaskSidebarProps {
  tasks: Task[]
  loading: boolean
}

export default function TaskSidebar({ tasks, loading }: TaskSidebarProps) {
  const getBadgeClassName = (priority: string) => {
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
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Recommended Tasks</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link href={`/task/${task.id}`}>
                <h3 className="font-medium text-lg text-gray-800 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <Badge className={getBadgeClassName(task.priority)}>
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-gray-500">Due: {new Date(task.deadline as string).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

