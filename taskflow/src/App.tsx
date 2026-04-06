// מביאים את useState ו־useEffect מ־React
import { useState, useEffect } from "react"

// מביאים את קומפוננטת TaskList מהתיקייה components
import TaskList from "./components/TaskList"

// מביאים את קובץ העיצוב
import "./App.css"

// מגדירים טיפוס Task עבור TypeScript
// מכיל את כל השדות שה־DB מחזיר
export type Task = {
  id: number             // מזהה ייחודי לכל משימה
  title: string          // כותרת המשימה
  completed: boolean     // האם המשימה הושלמה
  createdAt: string      // תאריך יצירת המשימה
  description?: string   // תיאור המשימה אופציונלי
  updatedAt?: string
}

// קומפוננטת App הראשית
function App() {

  // state לרשימת המשימות
  const [tasks, setTasks] = useState<Task[]>([])

  // state שמייצג האם אנחנו באמצע טעינה
  const [isLoading, setIsLoading] = useState(true)

  // state ליצירת משימה חדשה
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [createLoading, setCreateLoading] = useState(false)

  //delte task confirmation window
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null)

  //search for relavent tasks
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  )


  //creating new task button 
  const [showCreateModal, setShowCreateModal] = useState(false)

  
  // useEffect – רץ פעם אחת כשהקומפוננטה נטענת
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("http://localhost:3000/tasks")
        const data = await response.json()

        // ממפה את הנתונים כדי להתאים ל־type Task שלנו
        const mappedTasks: Task[] = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          createdAt: task.createdAt,
          description: task.description
        }))

        setTasks(mappedTasks)
        console.log(mappedTasks)

      } catch (error) {
        console.log("Error fetching tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // פונקציה ליצירת משימה חדשה
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return

    try {
      setCreateLoading(true)

      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || "" // שומר על string אם undefined
        })
      })

      const newTask = await response.json()
      setTasks(prev => [newTask, ...prev])

      setNewTitle("")
      setNewDescription("")

    } catch (error) {
      console.log("Error creating task:", error)
    } finally {
      setCreateLoading(false)
    }
  }


  // פונקציה לשינוי מצב completed
  const toggleTask = (id: number) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    
      return updated.sort((a, b) => Number(a.completed) - Number(b.completed))
    })
  }

  // פונקציה למחיקת משימה
  const deleteTask = (id: number) => {
    setTaskToDelete(id)
  }

  //delte task confirmation window

  const confirmDelete = async () => {
    if (taskToDelete === null) return
  
    try {
      await fetch(`http://localhost:3000/tasks/${taskToDelete}`, {
        method: "DELETE"
      })
  
      setTasks(prev => prev.filter(task => task.id !== taskToDelete))
    } catch (error) {
      console.log("Error deleting task:", error)
    } finally {
      setTaskToDelete(null)
    }
  }


  // פונקציה לעדכון משימה
  const updateTask = async (id: number, title: string, description?: string) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: description || "" })
      })

      const updatedTask = await response.json()
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...updatedTask, updatedAt: new Date().toISOString() } : task
      ))

    } catch (error) {
      console.log("Error updating task:", error)
    }
  }

  // מה שמוצג על המסך
  return (
    <div className="app-container">

      {/* כותרת ראשית */}
      <h1>TaskFlow</h1>

      <button 
        className="fab-btn"
        onClick={() => setShowCreateModal(true)}
      >
        +
      </button>

       {/*search tasks*/}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* רינדור לפי מצב טעינה */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      )}


      {/*add task button*/}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Task</h2>

            <form onSubmit={(e) => {
              handleCreateTask(e)
              setShowCreateModal(false)
            }} className="create-form">

              <input
                type="text"
                placeholder="New task title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Description (optional)"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
              />

              <div className="modal-buttons">
                <button type="submit" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Add Task"}
                </button>

                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      


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

export default App