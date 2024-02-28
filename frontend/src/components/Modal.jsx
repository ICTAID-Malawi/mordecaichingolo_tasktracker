import React from 'react'
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa';

const Modal = ({ mode, setShowModal, task, getData }) => {
  const editMode = mode === 'Edit' ? true : false

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : 'test@gmail.com',
    title: editMode ? task.title : null,
    date: editMode ? (task.data) : new Date()

  })

  const postData = async (e) => {
    e.preventDefault()
    try{
      const response = await fetch('http://localhost:8000/tasks',{
        method: "POST",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data)
      })
     if (response.status === 200){
      console.log('Working')
      setShowModal(false)
      getData()
     }
    } catch (err) {
      console.error(err)
    }
  }

  const editData = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method : 'PUT',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(data)
      })

      if (response.status === 200 ) {
        setShowModal(false)
        getData()
      }
    
        
      

    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setData(data => ({
      ...data,
      [name]: value
    }))

    console.log(data)
  }
  return (
    <div className='overlay'>
      <div className="modal">
        <div className='form-title-container'>
          <h3>{mode} Task</h3>
          <button onClick={() => setShowModal(false)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <FaTimes />
          </button>
        </div>

        <form>
          <input
            required
            maxLength={30}
            placeholder='Create a Task'
            name='title'
            value={data.title}
            onChange={handleChange}

          />
          <br />
          <input
            className={mode}
            type="submit"
            onClick={editMode ? editData: postData}
            style={{
              backgroundColor: '#363636',
              color: 'white',
              transition: 'opacity 0.3s ease',
              opacity: 1,
              border: 'none', // Remove the border
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}

          />

        </form>

      </div>
    </div>
  )
}

export default Modal