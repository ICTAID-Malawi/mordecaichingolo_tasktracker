import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';
import Modal from './Modal';

const ListItems = ({ task, getData }) => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
                method: 'DELETE',
            });
            if (response.status === 200) {
                getData(); // Fetch updated data after deletion
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="list-item">
            <div className="info-container">
                <AiOutlineCheckCircle className="tick-icon" /> {/* Tick Icon */}
                <p>{task.title}</p>
            </div>
            <div className="icon-container">
                <button className='edit' onClick={() => setShowModal(true)}><AiOutlineEdit /> Edit</button> {/* Edit Icon */}
                <button className='delete' style={{color: '#ce4e4e'}} onClick={handleDelete}><AiOutlineDelete /> Delete</button> {/* Delete Icon */}
            </div>
            {showModal && <Modal mode={'Edit'} setShowModal={setShowModal} getData={getData} task={task} />}
        </div>
    );
};

export default ListItems;
