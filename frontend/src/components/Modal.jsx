import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ mode, setShowModal, task, getData }) => {
  const editMode = mode === 'Edit';
  const [cookies] = useCookies();

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email || '',
    title: '',
    description: '',
    progress: 0,
    start_date: new Date().toISOString().slice(0, 10),
    finish_date: new Date().toISOString().slice(0, 10)
  });

  const [fetchError, setFetchError] = useState(null);
  const [submitting, setSubmitting] = useState(false); 
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setData({
        user_email: task.user_email ,
        title: task.title,
        description: task.description,
        progress: task.progress,
        start_date: task.start_date,
        finish_date: task.finish_date
      });
    }
  }, [task, cookies]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!data.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Add more validation rules as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postData = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.status === 201) {
        setShowModal(false); // Close the modal
        getData(); // Update the task list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.status === 200) {
        setShowModal(false); // Close the modal
        getData(); // Update the task list
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
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
          {errors.title && <div className="error">{errors.title}</div>}
          <input
            required
            maxLength={255}
            placeholder='Add Task Description'
            name='description'
            value={data.description}
            onChange={handleChange}
          />
          {errors.description && <div className="error">{errors.description}</div>}
          <br />
          <p>Start Date</p>
          <input
            required
            type='date'
            placeholder='Start Date'
            name='start_date'
            value={data.start_date}
            onChange={handleChange}
          />
          <br />
          <p>Finish Date</p>
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
            onClick={editMode ? editData : postData}
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
          />
        </form>
      </div>
    </div>
  );
}

export default Modal;
