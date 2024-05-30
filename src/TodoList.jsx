import React, { useState, useEffect } from 'react';
import { MdOutlineDoneOutline, MdDelete, MdEdit } from "react-icons/md";
import './App.css'

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  const addTask = (taskText) => {
  if (taskText.trim() !== "") {
    // Check if the task already exists
    const taskExists = tasks.some(task => task.text === taskText.trim());
    if (!taskExists) {
      const currentDate = new Date().toLocaleDateString();
      const newTask = { id: Date.now(), text: taskText, completed: false, date: currentDate };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('todolist', JSON.stringify(updatedTasks));
    } else {
      console.log("Task already exists!");
      // You can show a message to the user or handle it in any way you prefer
    }
    }
  };


  const completeTask = (taskId) => {
    const updatedTask = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      }
      return task;
    });
    setTasks(updatedTask);
    localStorage.setItem('todolist', JSON.stringify(updatedTask));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('todolist', JSON.stringify(updatedTasks));
  };

  const editTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find(task => task.id === taskId);
    setEditedTaskText(taskToEdit.text);
  };

  const saveEditedTask = () => {
    const updatedTasks = tasks.map(task => {
      if (task.id === editTaskId) {
        return { ...task, text: editedTaskText };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('todolist', JSON.stringify(updatedTasks));
    setEditTaskId(null);
    setEditedTaskText('');
  };

  useEffect(() => {
    let savedTodos = JSON.parse(localStorage.getItem('todolist'));
    if (savedTodos) {
      setTasks(savedTodos);
    }
  }, []);

  const sortedTasks = [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  
  return (
    <div className="bg-slate-900 p-5 rounded-3xl shadow-lg">
      <div className='text-center'> 
        <h1 className="text-2xl font-bold mb-4">To Do Lists</h1>
      </div>
    
      <div className=" text-center mb-4 content-between px-24">
        <input type="text" placeholder="Enter your tasks here" className="flex-grow border border-gray-300 rounded-2xl w-1/2 px-4 py-2 min-h-7 min-w-max" id="taskInput" />
        <button onClick={() => addTask(document.getElementById('taskInput').value)} className="bg-blue-500 text-white px-4 py-2 rounded-2xl">Add Task</button>
      </div>

      <div className='text-center mb-4 content-between px-20'>
        <ul>
        {sortedTasks.map(task => (
          <li key={task.id} className="flex items-center justify-between border-b border-gray-300 py-2">
            {editTaskId === task.id ? (
              <input type="text" value={editedTaskText} onChange={(e) => setEditedTaskText(e.target.value)} className="flex-grow border border-gray-300 rounded-l px-4 py-2" />
            ) : (
              <>
                <span className={`flex-grow ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                <span className="text-sm text-gray-500">{task.date}</span>
              </>
            )}

            {!task.completed && (
              <>
                <button onClick={() => completeTask(task.id)} className="text-green-500 mx-1"><MdOutlineDoneOutline /></button>
                <button onClick={() => editTask(task.id)} className="text-blue-500 mx-1"><MdEdit /></button>
              </>
            )}

            <button onClick={() => deleteTask(task.id)} className="text-red-500 mx-1"><MdDelete /></button>

            {editTaskId === task.id && (
              <button onClick={saveEditedTask} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            )}
          </li>
        ))}
      </ul>
      </div>
      
    </div>
    
  );
}

export default TodoList;
