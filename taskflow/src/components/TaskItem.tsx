// מביאים useState לניהול state פנימי
import { useState } from "react"

// מביאים את הטיפוס Task
import type { Task } from "../App"

// Props של הקומפוננטה
type Props = {
  task: Task // המשימה עצמה
  onToggle: () => void // שינוי completed
  onDelete: () => void // מחיקה
  onUpdate: (title: string, description?: string) => void // עדכון (description אופציונלי)
  isLoading: boolean // מצב טעינה
  isError: boolean // מצב שגיאה
}

// קומפוננטה שמציגה משימה בודדת
export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
  isLoading,
  isError
}: Props) {

  // state שמנהל אם אנחנו במצב עריכה או לא
  const [isEditing, setIsEditing] = useState(false)

  // state לשדות עריכה
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || "")

  // פונקציה לשמירת עריכה
  const handleSave = () => {
    onUpdate(editTitle, editDescription) // שולח את הערכים החדשים להורה
    setIsEditing(false) // יוצא ממצב עריכה
  }

  return (
    <div className="task-item">

      {/* header - checkbox + title */}
      <div className="task-header">

        {/* checkbox לשליטה ב־completed */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
        />

        {/* אם המשימה הושלמה → מוסיפים class שמוסיף קו */}
        <span className={task.completed ? "completed" : ""}>
          {task.title}
        </span>

      </div>

      {isEditing ? (
        <>
          {/* מצב עריכה */}

          {/* אינפוט לכותרת */}
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
          />

          {/* אינפוט לתיאור */}
          <input
            type="text"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
          />

          {/* כפתורים */}
          <div className="task-actions">

            {/* שמירה */}
            <button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>

            {/* ביטול */}
            <button onClick={() => setIsEditing(false)}>
              Cancel
            </button>

          </div>
        </>
      ) : (
        <>
          {/* מצב רגיל */}

          {/* תיאור המשימה */}
          {task.description && (
            <p className="task-description">
              {task.description}
            </p>
          )}

          {/* כפתורים */}
          <div className="task-actions">

            {/* מעבר לעריכה */}
            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            {/* מחיקה */}
            <button onClick={onDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </button>

          </div>
        </>
      )}

      {/* תאריך יצירה */}
      {task.createdAt && (
        <p className="task-date">
          {new Date(task.createdAt).toLocaleString()}
        </p>
      )}

      {/* תאריך עדכון */}
      {task.updatedAt && (
        <p className="task-updated">
          Last updated: {new Date(task.updatedAt).toLocaleString()}
        </p>
      )}

      {/* שגיאה אם קיימת */}
      {isError && <p style={{ color: "red" }}>Error!</p>}

    </div>
  )
}