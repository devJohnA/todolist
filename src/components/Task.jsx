import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_URL = 'https://backend-todo-1-n48d.onrender.com/';

const Task = () => {

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' or 'completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on viewMode
  useEffect(() => {
    if (viewMode === 'pending') {
      setFilteredTasks(tasks.filter(task => !task.completed));
    } else {
      setFilteredTasks(tasks.filter(task => task.completed));
    }
  }, [tasks, viewMode]);

  // Fetch all tasks from the backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/task`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    try {
      const response = await axios.post(`${API_URL}/task`, newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Add task error:', err);
    }
  };

  // Update a task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
  
    if (!editTask || !editTask.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Task title cannot be empty.',
      });
      return;
    }
  
    try {
      const response = await axios.put(`${API_URL}/task/${editTask._id}`, editTask);
      setTasks(tasks.map(task => task._id === editTask._id ? response.data : task));
      setEditTask(null);
  
      Swal.fire({
        icon: 'success',
        title: 'Task Updated',
        text: 'The task was successfully updated.',
        timer: 2000,
        showConfirmButton: false,
      });
  
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Update task error:', err);
  
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while updating the task.',
      });
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this task? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/task/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
  
        Swal.fire(
          'Deleted!',
          'Task has been deleted.',
          'success'
        );
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Delete task error:', err);
        Swal.fire(
          'Error!',
          'Something went wrong while deleting the task.',
          'error'
        );
      }
    }
  };

  // Toggle task completion status
  const handleToggleComplete = async (taskId) => {
    try {
      const response = await axios.patch(`${API_URL}/task/${taskId}/complete`);
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Toggle complete error:', err);
    }
  };

  // Handle input changes for new task
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewTask({
      ...newTask,
      [id === 'tasktitle' ? 'title' : 'description']: value
    });
  };

  // Handle input changes for edit task
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTask({
      ...editTask,
      [name]: value
    });
  };


  return (
    <div className="px-4 mt-8 max-w-6xl mx-auto">
      <div className='text-center text-2xl text-gray-800 dark:text-white font-bold mb-8'>
        To-do list
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form Section */}
        <div className="w-full lg:w-[calc(50%-12px)] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {editTask ? (
            <form className='px-4 md:px-8 pt-6 pb-8 mb-4' onSubmit={handleUpdateTask}>
              <div className='mb-4'>
                <label className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'>
                  Edit Task Title
                </label>
                <input 
                  type='text' 
                  className='w-full bg-white dark:bg-gray-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                  name="title" 
                  value={editTask.title}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'>
                  Edit Task Description
                </label>
                <input 
                  type='text' 
                  className='w-full bg-white dark:bg-gray-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                  name="description" 
                  value={editTask.description || ''}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className='w-20 mt-4 rounded-md bg-gray-500 hover:bg-gray-700 py-1 text-white mb-3 cursor-pointer transition-colors'
                  onClick={() => setEditTask(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className='w-20 mt-4 rounded-md bg-blue-500 hover:bg-blue-700 py-1 text-white mb-3 cursor-pointer transition-colors'
                >
                  Update
                </button>
              </div>
            </form>
          ) : (
            <form className='px-4 md:px-8 pt-6 pb-8 mb-4' onSubmit={handleAddTask}>
              <div className='mb-4'>
                <label className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'>
                  Task Title
                </label>
                <input 
                  type='text' 
                  className='w-full bg-white dark:bg-gray-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                  id="tasktitle" 
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'>
                  Task Description
                </label>
                <input 
                  type='text' 
                  className='w-full bg-white dark:bg-gray-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                  id="taskdescription" 
                  placeholder="e.g. What needs to be done?"
                  value={newTask.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className='w-20 mt-4 rounded-md bg-blue-500 hover:bg-blue-700 py-1 text-white float-right mb-3 cursor-pointer transition-colors'
                disabled={!newTask.title.trim()}
              >
                Add
              </button>
            </form>
          )}
        </div>

        {/* Tasks Section */}
        <div className="w-full lg:w-[calc(50%-12px)] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className='flex justify-center gap-4 sm:gap-8 mb-4 text-lg font-semibold'>
            <h2 
              className={`${viewMode === 'pending' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'} cursor-pointer transition-colors`}
              onClick={() => setViewMode('pending')}
            >
              Pending
            </h2>
            <h2 
              className={`${viewMode === 'completed' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'} cursor-pointer transition-colors`}
              onClick={() => setViewMode('completed')}
            >
              Completed
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task._id} className='flex justify-between items-center p-3 mb-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <div>
                  <p className={`text-sm font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs ${task.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <button 
                    className='text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors'
                    onClick={() => setEditTask(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} className='text-lg' />
                  </button>
                  <button 
                    className='text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors'
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className='text-lg' />
                  </button>
                  <button 
                    className={`text-gray-500 dark:text-gray-400 ${task.completed ? 'hover:text-yellow-500' : 'hover:text-green-500'} transition-colors`}
                    onClick={() => handleToggleComplete(task._id)}
                  >
                    <FontAwesomeIcon icon={faCheck} className='text-lg' />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center text-sm text-gray-400 dark:text-gray-500 py-4'>
              {viewMode === 'pending' ? 'No pending tasks' : 'No completed tasks'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;