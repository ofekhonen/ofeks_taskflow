// Import useState and useEffect from React
import { useState, useEffect } from "react"

// Import TaskList component from components folder
import TaskList from "./components/TaskList"

// Import CSS styles
import "./App.css"

// Define Task type for TypeScript
// Represents the structure returned from the database
export type Task = {
  id: number             // Unique ID for each task
  title: string          // Task title
  completed: boolean     // Whether the task is completed
  createdAt: string      // Creation date of the task
  description?: string   // Optional task description
  updatedAt?: string     // Optional last update date
}

// Main App component
function App() {

  // State for storing all tasks
  const [tasks, setTasks] = useState<Task[]>([])

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true)

  // State for creating a new task
  const [newTitle, setNewTitle] = useState("") // New task title
  const [newDescription, setNewDescription] = useState("") // New task description
  const [createLoading, setCreateLoading] = useState(false) // Loading state while creating

  // State for delete confirmation modal (stores task ID or null)
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null)

  // State for search input
  const [searchTerm, setSearchTerm] = useState("")

  // Filter tasks based on search term (title or description)
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Match title
    (task.description?.toLowerCase().includes(searchTerm.toLowerCase())) // Match description if exists
  )

  // State to control "Create Task" modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false)

  // useEffect runs once when component mounts
  useEffect(() => {
    // Function to fetch tasks from backend
    const fetchTasks = async () => {
      try {
        setIsLoading(true) // Start loading

        const response = await fetch("http://localhost:3000/tasks") // API call
        const data = await response.json() // Convert response to JSON

        // Map backend data to match Task type
        const mappedTasks: Task[] = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          createdAt: task.createdAt,
          description: task.description
        }))

        setTasks(mappedTasks) // Save tasks to state
        console.log(mappedTasks) // Debug log

      } catch (error) {
        console.log("Error fetching tasks:", error) // Error handling
      } finally {
        setIsLoading(false) // Stop loading regardless of success/failure
      }
    }

    fetchTasks() // Call function
  }, []) // Empty dependency array = runs once

  // Function to create a new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent page reload
    if (!newTitle) return // Don't create if title is empty

    try {
      setCreateLoading(true) // Start loading

      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST", // HTTP POST request
        headers: { "Content-Type": "application/json" }, // Send JSON
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || "" // Ensure it's always a string
        })
      })

      const newTask = await response.json() // Get created task from server
      setTasks(prev => [newTask, ...prev]) // Add new task at top

      setNewTitle("") // Reset input
      setNewDescription("") // Reset input

    } catch (error) {
      console.log("Error creating task:", error)
    } finally {
      setCreateLoading(false) // Stop loading
    }
  }

  // Function to toggle task completion
  const toggleTask = (id: number) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === id 
          ? { ...task, completed: !task.completed } // Toggle completed
          : task
      )
    
      // Sort: incomplete tasks first
      return updated.sort((a, b) => Number(a.completed) - Number(b.completed))
    })
  }

  // Function to trigger delete confirmation
  const deleteTask = (id: number) => {
    setTaskToDelete(id) // Open modal with selected task ID
  }

  // Function to confirm deletion
  const confirmDelete = async () => {
    if (taskToDelete === null) return // Safety check
  
    try {
      await fetch(`http://localhost:3000/tasks/${taskToDelete}`, {
        method: "DELETE" // Send DELETE request
      })
  
      // Remove task from UI
      setTasks(prev => prev.filter(task => task.id !== taskToDelete))
    } catch (error) {
      console.log("Error deleting task:", error)
    } finally {
      setTaskToDelete(null) // Close modal
    }
  }

  // Function to update a task
  const updateTask = async (id: number, title: string, description?: string) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT", // Update request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description: description || "" // Ensure string
        })
      })

      const updatedTask = await response.json()

      // Update task in state
      setTasks(prev => prev.map(task =>
        task.id === id 
          ? { ...updatedTask, updatedAt: new Date().toISOString() } // Add updated timestamp
          : task
      ))

    } catch (error) {
      console.log("Error updating task:", error)
    }
  }

  // Render UI
  return (
    <div className="app-container">

      {/* Main title */}
      <h1>TaskFlow</h1>

      {/* Floating add button */}
      <button 
        className="fab-btn"
        onClick={() => setShowCreateModal(true)} // Open modal
      >
        +
      </button>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search
        className="search-input"
      />

      {/* Conditional rendering based on loading */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TaskList
          tasks={filteredTasks} // Pass filtered tasks
          onToggle={toggleTask} // Toggle handler
          onDelete={deleteTask} // Delete handler
          onUpdate={updateTask} // Update handler
        />
      )}

      {/* Create task modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Task</h2>

            <form 
              onSubmit={(e) => {
                handleCreateTask(e) // Create task
                setShowCreateModal(false) // Close modal
              }} 
              className="create-form"
            >

              {/* Title input */}
              <input
                type="text"
                placeholder="New task title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />

              {/* Description input */}
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
              />

              {/* Modal buttons */}
              <div className="modal-buttons">
                <button type="submit" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Add Task"}
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} // Close modal
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {taskToDelete !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this task?</p>

            <div className="modal-buttons">
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={() => setTaskToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App // Export App component