import { useState } from "react"

type Props = {
  onCreate: (title: string, description?: string) => void
  onClose: () => void
  loading: boolean
}

export default function CreateTaskModal({ onCreate, onClose, loading }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate(title, description)
    setTitle("")
    setDescription("")
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit} className="create-form">
          <input
            type="text"
            placeholder="New task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>{loading ? "Creating..." : "Add Task"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}