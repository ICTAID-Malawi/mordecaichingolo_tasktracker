import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ActivityModal from './ActivityModal';
import { FaPlus } from 'react-icons/fa';

const ListItems = ({ task, getData }) => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteButtonRef, setDeleteButtonRef] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showActivityModal, setShowActivityModal] = useState(false);

    useEffect(() => {
        if (task && task.id) {
            fetchActivities();
        }
    }, [task]);

    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/activities/${task.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                getData(); // Fetch updated data after deletion
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            setError(error.message);
        }
        setShowConfirmModal(false);
    };

    if (!task || !task.id) {
        return <div>No task data available</div>;
    }

    return (
        <div className="card">
            <div className="card-header">
                <AiOutlineCheckCircle className="tick-icon" />
                <h3>Title: {task.title}</h3>
            </div>
            <div className="card-body">
                <p>Description: {task.description}</p>
                <p>Start Date: {task.start_date}</p>
                <p>Finish Date: {task.finish_date}</p>
            </div>
            <div className="activities">
                <h4>Activities:</h4>
                {loading ? (
                    <p>Loading activities...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <ul>
                        {activities.map(activity => (
                            <li key={activity.id}>{activity.description}</li>
                        ))}
                    </ul>
                )}
                <button onClick={() => setShowActivityModal(true)} className="add-activity-button">
                    <FaPlus /> Add
                </button>
            </div>
            <div className="card-footer">
                <button className='edit' onClick={() => setShowModal(true)}>
                    <AiOutlineEdit /> Edit
                </button>
                <button
                    className='delete'
                    style={{ color: '#ce4e4e' }}
                    onClick={() => setShowConfirmModal(true)}
                    ref={ref => setDeleteButtonRef(ref)}
                >
                    <AiOutlineDelete /> Delete
                </button>
            </div>
            {showModal && <Modal mode={'Edit'} setShowModal={setShowModal} getData={getData} task={task} />}
            <ConfirmDeleteModal
                show={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={handleDelete}
                anchorElement={deleteButtonRef}
            />
            {showActivityModal && (
                <ActivityModal
                    setShowActivityModal={setShowActivityModal}
                    fetchData={fetchActivities}
                    taskId={task.id}
                />
            )}
        </div>
    );
};

export default ListItems;
