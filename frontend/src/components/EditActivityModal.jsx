import React, { useState } from 'react';

const EditActivityModal = ({ activity, onClose, onDelete, onComplete, onSave }) => {
    const [editedActivity, setEditedActivity] = useState(activity);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedActivity(prevActivity => ({
            ...prevActivity,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSave(editedActivity);
        onClose();
    };

    return (
        <div className="edit-activity-modal">
            <h2>Edit Activity</h2>
            <input type="text" name="activity_title" value={editedActivity.activity_title} onChange={handleChange} />
            <div className="button-group">
                <button className="delete" onClick={handleSubmit}>Save</button>
                <button className="delete" onClick={onDelete}>Delete</button>
                <button className="delete" onClick={onComplete}>Mark as Complete</button>
                <button className="delete" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default EditActivityModal;
