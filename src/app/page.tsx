'use client'

import { useState, useEffect } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }))
      setTodos(parsedTodos)
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      }
      setTodos([newTodo, ...todos])
      setInputValue('')
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.length - completedCount

  return (
    <div className="container">
      <h1 className="app-title">Todo List</h1>
      
      <div className="todo-form">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button 
            onClick={addTodo}
            disabled={inputValue.trim() === ''}
            className="add-btn"
          >
            Add
          </button>
        </div>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos yet</h3>
            <p>Add a todo above to get started!</p>
          </div>
        ) : (
          <>
            {todos.map(todo => (
              <div key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}
            
            {todos.length > 0 && (
              <div className="stats">
                <span>{activeCount} active, {completedCount} completed</span>
                <button
                  onClick={clearCompleted}
                  disabled={completedCount === 0}
                  className="clear-completed"
                >
                  Clear Completed
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
