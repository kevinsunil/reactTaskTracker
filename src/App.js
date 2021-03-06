import {useEffect, useState} from "react";
import {BrowserRouter as Router,Route} from "react-router-dom"
import Header from './Components/Header'
import Tasks from './Components/Tasks'
import AddTask from './Components/AddTask'
import Footer from './Components/Footer'
import About from './Components/About'
const App = () => {
    const[showAddTask,setShowAddTask] = useState(false)
    const[tasks,setTasks] = useState([])
    useEffect(()=>{
        const getTasks = async () =>{
            const tasksFromServer = await fetchTasks()
            setTasks(tasksFromServer)
        }
        getTasks()
    },[])
    //fetch tasks
    const fetchTasks = async () => {
        const res = await fetch('http://localhost:5000/tasks')
        const data = await res.json()
        return data
    }
    //Delete Task
    const deleteTask = async (id) =>{
        await fetch(`http://localhost:5000/tasks/${id}`,{
            method : 'DELETE'
        })
        setTasks(tasks.filter((task)=>task.id !== id))
    }
    //fetch task
    const fetchTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`)
        const data = await res.json()
        return data
    }
    //set reminder
    const Reminder = async (id) =>{
        const taskToToggle = await fetchTask(id)
        const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}
        const res = await fetch(`http://localhost:5000/tasks/${id}`,{
            method:'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(updTask),
        })
        const data = await res.json()
       setTasks(tasks.map((task) => task.id === id ? {...task ,reminder : data.reminder} : task))
    }
    //add task
    const addTask = async (task) => {
        const res = await fetch('http://localhost:5000/tasks',{
            method: 'POST',
            headers : {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        const data = await res.json()
        setTasks([...tasks,data])
        // const  id = Math.floor(Math.random()*5000)+1
        // const newTask ={id, ...task}
        // setTasks([...tasks,newTask])
    }

  return (
      <Router>
          <div className="container">
              <Header onAdd ={()=>setShowAddTask(!showAddTask)} showAdd ={showAddTask}/>

              <Route path ='/' exact render={(props)=>(
                  <>
                  {showAddTask && <AddTask onAdd={addTask}/>}
              {tasks.length > 0 ? (
                  <Tasks tasks ={tasks} onDelete = {deleteTask} onToggle ={Reminder}/>) : ('No Tasks Left To Do')
              }

                  </>
              )}
                  />
              <Route path ='/about' component={About} />
              <Footer />
          </div>
      </Router>

  )
}

export default App;
