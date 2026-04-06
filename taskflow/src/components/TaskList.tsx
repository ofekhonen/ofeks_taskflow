// Import TaskItem component
import TaskItem from "./TaskItem"

// Import Task type from App file
import type { Task } from "../App"

// Props received from App component
type Props = {
  tasks: Task[] // Array of all tasks
  onToggle: (id: number) => void // Function to toggle completed state
  onDelete: (id: number) => void // Function to delete a task
  onUpdate: (id: number, title: string, description?: string) => void // Function to update a task (description optional)
}

// Component that renders all tasks
export default function TaskList({ tasks, onToggle, onDelete, onUpdate }: Props) {
  return (
    <div className="task-list"> {/* Container for all task items */}

      {/* Loop through tasks using map */}
      {tasks.map(task => (

        <TaskItem
          key={task.id} // Unique key required by React for list rendering

          task={task} // Pass the task object to TaskItem

          // Handle toggle (wrap with arrow function to pass id)
          onToggle={() => onToggle(task.id)}

          // Handle delete
          onDelete={() => onDelete(task.id)}

          // Handle update (pass new values + current task id)
          onUpdate={(title, description) =>
            onUpdate(task.id, title, description)
          }

          isLoading={false} // Placeholder for future loading state
          isError={false}   // Placeholder for future error state
        />

      ))}

    </div>
  )
}