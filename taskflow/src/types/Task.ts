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