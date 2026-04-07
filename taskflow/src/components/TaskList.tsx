import TaskItem from "./TaskItem"
import type { Task } from "../types/Task"

type Props = {
  tasks: Task[]
  isLoading: boolean // הוספנו את ה־loading
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, title: string, description?: string) => void
}

export default function TaskList({ tasks, isLoading, onToggle, onDelete, onUpdate }: Props) {
  if (isLoading) return <p>Loading...</p>  // הצגת Loading אם עדיין נטען

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
          onUpdate={(title, description) => onUpdate(task.id, title, description)}
          isLoading={false} 
          isError={false} 
        />
      ))}
    </div>
  )
}