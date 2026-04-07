import "./App.css"
import { useState } from "react"
import Header from "./components/Header"
import TaskList from "./components/TaskList"
import CreateTaskModal from "./components/CreateTaskModal"
import DeleteTaskModal from "./components/DeleteTaskModal"
import { useTasks } from "./hooks/useTasks"

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const {
    tasks,
    isLoading,
    createLoading,
    taskToDelete,
    setTaskToDelete,
    handleCreateTask,
    toggleTask,
    handleUpdateTask,
    handleDeleteTask
  } = useTasks()

  // סינון לפי החיפוש
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="app-container">

      {/* כותרת, חיפוש וכפתור + */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setShowCreateModal(true)}
      />

      {/* רשימת משימות */}
      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        onToggle={toggleTask}
        onDelete={setTaskToDelete}
        onUpdate={handleUpdateTask}
      />

      {/* מודל יצירת משימה */}
      {showCreateModal && (
        <CreateTaskModal
          onCreate={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
          loading={createLoading}
        />
      )}

      {/* מודל מחיקת משימה */}
      {taskToDelete !== null && (
        <DeleteTaskModal
          onConfirm={handleDeleteTask}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

    </div>
  )
}

export default App