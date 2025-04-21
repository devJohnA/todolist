import Navbar from './components/Navbar'
import Task from './components/Task'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className='container mx-auto px-4 py-8'>
        <Navbar/>
        <Task/>
        <Footer/>
      </div>
    </div>
  )
}

export default App