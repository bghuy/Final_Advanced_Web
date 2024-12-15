import { TaskTable } from "@/app/(protected)/tasks/components/TaskTable"

export default function TaskManagerPage() {
  return (
    <div className="container mx-auto py-10 h-screen px-2">
      <h1 className="text-2xl font-bold mb-5">Task Manager</h1>
      <TaskTable />
    </div>
  )
}

