
import { useEffect, useState } from 'react'
import ListHeader from './components/ListHeader'
import ListItems from './components/ListItems'
import Auth from './components/Auth'
import { useCookies } from 'react-cookie'


const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken
  const [tasks, setTask] = useState(null)


  const getData = async () => {

    try {
      const response = await fetch(`http://localhost:8000/tasks/${userEmail}`)
      const json = await response.json()

      setTask(json)
    } catch (err) {
      console.error(err)
    }

  }

  useEffect(() => {
  if (authToken) {
    getData()
  }
  } 
  , [])

  console.log(tasks)

  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date));


  return (
    <div className='app'>
      {!authToken && <Auth/>}
      {authToken &&
        <>
          <ListHeader ListName={'Task Tracker'} getData={getData} />
          {sortedTasks?.map((task) => <ListItems key={task.id} task={task} getData={getData} />)}
        </>}

    </div>

  )
}

export default App;