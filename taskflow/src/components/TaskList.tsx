// מביאים את קומפוננטת TaskItem
import TaskItem from "./TaskItem"

// מביאים את הטיפוס Task
import type { Task } from "../App"

// Props שמגיעים מהקומפוננטה App
type Props = {
  tasks: Task[] // רשימת המשימות
  onToggle: (id: number) => void // שינוי מצב completed
  onDelete: (id: number) => void // מחיקת משימה
  onUpdate: (id: number, title: string, description?: string) => void // עדכון משימה (description אופציונלי)
}

// קומפוננטה שמציגה את כל המשימות
export default function TaskList({ tasks, onToggle, onDelete, onUpdate }: Props) {
  return (
    <div className="task-list">

      {/* עוברים על כל המשימות עם map */}
      {tasks.map(task => (

        <TaskItem
          key={task.id} // חשוב ל־React כדי לזהות כל אלמנט

          task={task} // המשימה עצמה

          // פונקציה לשינוי completed
          onToggle={() => onToggle(task.id)}

          // פונקציה למחיקה
          onDelete={() => onDelete(task.id)}

          // פונקציה לעדכון
          onUpdate={(title, description) =>
            onUpdate(task.id, title, description)
          }

          isLoading={false} // אפשר להרחיב בעתיד
          isError={false}   // אפשר להרחיב בעתיד
        />

      ))}

    </div>
  )
}