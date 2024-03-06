import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ mode, setShowModal, task, getData }) => {
  const editMode = mode === 'Edit';

  const [data, setData] = useState({
    user_email: task ? task.user_email : '',
    title: task ? task.title : '',
    description: task ? task.description : '',
    progress: task ? task.progress : 0,
    start_date: task ? task.start_date : new Date().toISOString().slice(0, 10),
    finish_date: task ? task.finish_date : new Date().toISOString().slice(0, 10)
  });

  const [fetchError, setFetchError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // For disabling submit button during submission

  useEffect(() => {
    if (editMode && task) {
      // Fetch additional data if needed
    }
  }, [editMode, task]);

  const addOrUpdateTask = async () => {
    try {
      setSubmitting(true);
      if (editMode) {
        // Update task
        const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          throw new Error('Failed to edit task');
        }
      } else {
        // Create task
        const response = await fetch(`http://localhost:8000/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          throw new Error('Failed to create task');
        }
      }
      
      setShowModal(false);
      getData();
    } catch (err) {
      console.error(err);
      // Show error message to the user
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

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
            maxLength={100}
            placeholder='Enter Task Title'
            name='title'
            value={data.title}
            onChange={handleChange}
          />
          <input
            required
            maxLength={255}
            placeholder='Add Task Description'
            name='description'
            value={data.description}
            onChange={handleChange}
          />
          <br />
          <input
            required
            type='number'
            min='0'
            max='100'
            placeholder='Enter Progress (0-100)'
            name='progress'
            value={data.progress}
            onChange={handleChange}
          />
          <br />
          <input
            required
            type='date'
            placeholder='Start Date'
            name='start_date'
            value={data.start_date}
            onChange={handleChange}
          />
          <br />
          <input
            required
            type='date'
            placeholder='Finish Date'
            name='finish_date'
            value={data.finish_date}
            onChange={handleChange}
          />
          <br />
          {fetchError && <div>Error: {fetchError}</div>}

          <br />
          <input
            className={mode}
            type="submit"
            onClick={addOrUpdateTask}
            style={{
              backgroundColor: '#363636',
              color: 'white',
              transition: 'opacity 0.3s ease',
              opacity: 1,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
            disabled={submitting} // Disable submit button during submission
          />
        </form>
      </div>
    </div>
  );
}

export default Modal;
