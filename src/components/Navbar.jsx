import React, { useState, useEffect } from 'react'
import logo from '../image/todolist.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() =>{
    const storedMode = localStorage.getItem('darkMode')
    if(storedMode === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() =>{
    if(darkMode) {
      
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    }else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])


  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }


  return (
    <nav className='block w-full bg-white dark:bg-gray-800 shadow-md rounded-md lg:py-5 px-5'>
      <div className='container flex flex-wrap items-center justify-between mx-auto text-slate-800 dark:text-white'>
        <a href="#" className='mr-4 cursor-pointer py-1.5 text-base font-semibold inline-flex items-center'>
          <img src={logo} className='h-6 w-6 mr-2' alt="Logo" />
          <p>To-do list</p>
        </a>
        <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          <li className='flex items-center p-1 text-sm gap-x-2'>
            <button 
              onClick={toggleDarkMode}
              className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-hover transition-colors cursor-pointer"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <FontAwesomeIcon 
                icon={darkMode ? faSun : faMoon} 
                className="text-xl" 
              />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar