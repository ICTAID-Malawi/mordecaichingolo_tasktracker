import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheckCircle, AiOutlineEllipsis } from 'react-icons/ai';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ActivityModal from './ActivityModal';
import EditActivityModal from './EditActivityModal'; // Import EditActivityModal
import { FaPlus } from 'react-icons/fa';

const ListItems = ({ task, getData }) => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteButtonRef, setDeleteButtonRef] = useState(null);
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleEditActivity = (activity) => {
        setSelectedActivity(activity);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setSelectedActivity(null);
        setShowEditModal(false);
    };

    const handleSaveEditedActivity = (editedActivity) => {
        // Make the API call to update the activity
        // Update the activities state with the edited activity
        // Close the modal
        setShowEditModal(false);
    };

    if (!task || !task.id) {
        return <div>No task data available</div>;
    }

    // Calculate progress percentage
    const progressPercentage = task.progress + '%';

    return (
        <div className="card-container">
            <div className="card">
                <div className="card-header">
                    <AiOutlineCheckCircle className="tick-icon" />
                    <h3>
                        Title: {task.title} - Progress: {progressPercentage}
                    </h3>
                </div>
                <div className="card-body">
                    <p>Description: {task.description}</p>
                    <p>Start Date: {task.start_date}</p>
                    <p>Finish Date: {task.finish_date}</p>
                </div>
                <div className="activities">
                    <h4>Activities:</h4>
                    <button onClick={() => setShowActivityModal(true)} className="add-activity-button">
                        <FaPlus /> Add
                    </button>
                </div>
                <div className='activity-list' style={{
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '10px',
                    marginTop: '-10px', // Move the div up by 10 pixels
                }}>
                    {loading ? (
                        <p style={{ margin: '0', padding: '10px' }}>Loading activities...</p>
                    ) : error ? (
                        <p style={{ margin: '0', padding: '10px' }}>Error: {error}</p>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {activities.map(activity => (
                                <li key={activity.id} style={{ padding: '5px 0', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center' }}>
                                    {activity.activity_title}
                                    <AiOutlineEllipsis onClick={() => handleEditActivity(activity)} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
                                </li>
                            ))}
                        </ul>
                    )}
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
                {showEditModal && (
                    <EditActivityModal
                        activity={selectedActivity}
                        onClose={handleCloseEditModal}
                        onSave={handleSaveEditedActivity}
                    />
                )}
            </div>
        </div>
    );
};

export default ListItems;
