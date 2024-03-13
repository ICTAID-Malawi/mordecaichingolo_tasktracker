import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheckCircle, AiOutlineEllipsis } from 'react-icons/ai';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ActivityModal from './ActivityModal';
import EditActivityModal from './EditActivityModal'; 
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
    const [completedActivitiesCount, setCompletedActivitiesCount] = useState(0);

    useEffect(() => {
        if (task && task.id) {
            fetchActivities();
        }
    }, [task]);

    const handleDeleteTask = async () => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // If the task is successfully deleted, trigger the getData callback to refresh the task list
                getData();
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            setError(error.message);
        }
        setShowConfirmModal(false);
    };

    useEffect(() => {
        const completedCount = activities.filter(activity => activity.is_completed).length;
        setCompletedActivitiesCount(completedCount);
    }, [activities]);

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

    const handleDelete = async (activityId) => {
        try {
            const response = await fetch(`http://localhost:8000/activities/${activityId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchActivities(); // Fetch updated data after deletion
            } else {
                throw new Error('Failed to delete activity');
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

    const handleSaveEditedActivity = async (editedActivity) => {
        try {
            const response = await fetch(`http://localhost:8000/activities/${editedActivity.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedActivity),
            });
            if (!response.ok) {
                throw new Error('Failed to save edited activity');
            }
            fetchActivities(); // Fetch updated data after editing
        } catch (error) {
            setError(error.message);
        }
        setShowEditModal(false);
    };

    const handleMarkAsComplete = async (activityId) => {
        try {
            const response = await fetch(`http://localhost:8000/activities/${activityId}/complete`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Failed to mark activity as complete');
            }
            fetchActivities(); // Fetch updated data after marking as complete
        } catch (error) {
            setError(error.message);
        }
    };

    if (!task || !task.id) {
        return <div>No task data available</div>;
    }

    // Calculate progress percentage
const totalActivitiesCount = activities.length;
const completedPercentage = totalActivitiesCount > 0 ? (completedActivitiesCount / totalActivitiesCount) * 100 : 0;

// Round the progress percentage to two decimal points
const roundedCompletedPercentage = completedPercentage.toFixed(2);

// Calculate total progress percentage including the task's progress
const totalProgressPercentage = parseFloat(task.progress) + parseFloat(roundedCompletedPercentage);
const roundedTotalProgressPercentage = totalProgressPercentage.toFixed(2);

// Convert the total progress percentage to a string with '%' appended
const progressPercentage = roundedTotalProgressPercentage + '%';


// Format dates
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because month indexes start from 0
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

    return (
        <div className="card-container" >
            <div className="card">
                <div className="card-header">
                    <div className="header-content">
                        {/* <AiOutlineCheckCircle className="tick-icon" /> */}
                        <h3>
                            {task.title} | {progressPercentage} Complete
                        </h3>
                    </div>

                    <div className="buttons">
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
                    
                </div>
                
                <div className="card-body">
                    <p>{task.description}</p>
                    <p>Start Date: {formatDate(task.start_date)}</p>
                    <p>Finish Date: {formatDate(task.finish_date)}</p>
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
                    marginTop: '-10px', 
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
                                    {activity.is_completed && <span style={{ marginLeft: 'auto', color: 'green' }}>Completed</span>}
                                    {!activity.is_completed && (
                                        <AiOutlineEllipsis onClick={() => handleEditActivity(activity)} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                
                
                {showModal && <Modal mode={'Edit'} setShowModal={setShowModal} getData={getData} task={task} />}
                <ConfirmDeleteModal
                    show={showConfirmModal}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleDeleteTask} 
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
                        onDelete={() => handleDelete(selectedActivity.id)}
                        onComplete={() => handleMarkAsComplete(selectedActivity.id)}
                    />
                )}
                
            </div>
        </div>

       
    );
};

export default ListItems;
