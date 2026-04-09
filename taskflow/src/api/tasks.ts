import type { Task } from "../types/Task"

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch("http://localhost:3000/tasks")
  const data = await response.json()
  return data.map((task: any) => ({
    id: task.id,
    title: task.title,
    completed: task.completed,
    createdAt: task.createdAt,
    description: task.description
  }))
}

// Create a new task
export const createTask = async (title: string, description?: string): Promise<Task> => {
  const response = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: description || "" })
  })
  return await response.json()
}

// Update a task
export const updateTask = async (id: number, title: string, description?: string): Promise<Task> => {
  const response = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: description || "" })
  })
  return await response.json()
}

// Delete a task
export const deleteTaskAPI = async (id: number) => {
  await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
}