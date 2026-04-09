import { useState, useEffect } from "react"
import type { Task } from "../types/Task"
import { fetchTasks, createTask, updateTask, deleteTaskAPI } from "../api/tasks"

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createLoading, setCreateLoading] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null)

  useEffect(() => {
    const getTasks = async () => {
      try {
        setIsLoading(true)
        const data = await fetchTasks()
        setTasks(data)
      } catch (err) {
        console.log("Error fetching tasks:", err)
      } finally {
        setIsLoading(false)
      }
    }
    getTasks()
  }, [])

  const handleCreateTask = async (title: string, description?: string) => {
    if (!title) return
    try {
      setCreateLoading(true)
      const task = await createTask(title, description)
      setTasks(prev => [task, ...prev])
    } catch (err) {
      console.log("Error creating task:", err)
    } finally {
      setCreateLoading(false)
    }
  }

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev
        .map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        .sort((a, b) => Number(a.completed) - Number(b.completed))
    )
  }

  const handleUpdateTask = async (id: number, title: string, description?: string) => {
    try {
      const updated = await updateTask(id, title, description)
      setTasks(prev => prev.map(t => t.id === id ? { ...updated, updatedAt: new Date().toISOString() } : t))
    } catch (err) {
      console.log("Error updating task:", err)
    }
  }

  const handleDeleteTask = async () => {
    if (taskToDelete === null) return
    try {
      await deleteTaskAPI(taskToDelete)
      setTasks(prev => prev.filter(t => t.id !== taskToDelete))
    } catch (err) {
      console.log("Error deleting task:", err)
    } finally {
      setTaskToDelete(null)
    }
  }

  return {
    tasks,
    isLoading,
    createLoading,
    taskToDelete,
    setTaskToDelete,
    handleCreateTask,
    toggleTask,
    handleUpdateTask,
    handleDeleteTask
  }
}