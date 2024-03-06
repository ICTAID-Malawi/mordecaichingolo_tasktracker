import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ActivityModal = ({ setShowActivityModal, fetchData, taskId }) => {
    const [newActivity, setNewActivity] = useState('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().slice(0, 10)); // Initialize with today's date

    const handleAddActivity = async () => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${taskId}/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: newActivity, date: activityDate })
            });
            if (!response.ok) {
                throw new Error('Failed to add activity');
            }
            fetchData(); // Fetch updated activities
        } catch (error) {
            console.error(error);
            // Handle error
        }
        setShowActivityModal(false);
    };

    return (
        <div className='overlay'>
            <div className="modal">
                <div className='form-title-container'>
                    <h3>Add Activity</h3>
                    <button onClick={() => setShowActivityModal(false)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </div>
                <form>
                    <input
                        placeholder="Add Activity"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                    />
                    <input
                        type="date"
                        value={activityDate}
                        onChange={(e) => setActivityDate(e.target.value)}
                    />
                    <button className='activity-button'onClick={handleAddActivity}>Add Activity</button>
                </form>
            </div>
        </div>
    );
};

export default ActivityModal;
