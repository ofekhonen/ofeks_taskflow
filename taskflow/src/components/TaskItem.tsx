// Import useState for managing internal component state
import { useState } from "react"

// Import Task type
import type { Task } from "../App"

// Component props
type Props = {
  task: Task // The task object
  onToggle: () => void // Toggle completed state
  onDelete: () => void // Delete task
  onUpdate: (title: string, description?: string) => void // Update task (description optional)
  isLoading: boolean // Loading state (e.g. saving/deleting)
  isError: boolean // Error state
}

// Component that represents a single task
export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
  isLoading,
  isError
}: Props) {

  // State to track if the task is in edit mode
  const [isEditing, setIsEditing] = useState(false)

  // State for editable fields (initialized with current task values)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || "")

  // Function to save changes
  const handleSave = () => {
    onUpdate(editTitle, editDescription) // Send updated values to parent component
    setIsEditing(false) // Exit edit mode
  }

  return (
    <div className="task-item"> {/* Main container for the task */}

      {/* Header section: checkbox + title */}
      <div className="task-header">

        {/* Checkbox to control completed state */}
        <input
          type="checkbox"
          checked={task.completed} // Controlled input
          onChange={onToggle} // Toggle handler
        />

        {/* Task title (with conditional class if completed) */}
        <span className={task.completed ? "completed" : ""}>
          {task.title}
        </span>

      </div>

      {isEditing ? (
        <>
          {/* EDIT MODE */}

          {/* Input for editing title */}
          <input
            type="text"
            value={editTitle} // Controlled input
            onChange={e => setEditTitle(e.target.value)} // Update state on change
          />

          {/* Input for editing description */}
          <input
            type="text"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
          />

          {/* Action buttons */}
          <div className="task-actions">

            {/* Save button */}
            <button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"} {/* Show loading text if needed */}
            </button>

            {/* Cancel editing */}
            <button onClick={() => setIsEditing(false)}>
              Cancel
            </button>

          </div>
        </>
      ) : (
        <>
          {/* VIEW MODE */}

          {/* Task description (only if exists) */}
          {task.description && (
            <p className="task-description">
              {task.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="task-actions">

            {/* Enter edit mode */}
            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            {/* Delete button */}
            <button onClick={onDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </button>

          </div>
        </>
      )}

      {/* Created date */}
      {task.createdAt && (
        <p className="task-date">
          {new Date(task.createdAt).toLocaleString()} {/* Format date */}
        </p>
      )}

      {/* Updated date */}
      {task.updatedAt && (
        <p className="task-updated">
          Last updated: {new Date(task.updatedAt).toLocaleString()}
        </p>
      )}

      {/* Error message */}
      {isError && <p style={{ color: "red" }}>Error!</p>}

    </div>
  )
}