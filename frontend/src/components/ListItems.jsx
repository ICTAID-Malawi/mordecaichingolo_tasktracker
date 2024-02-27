import React from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';

const ListItems = ({ task }) => {
    return (
        <div className="list-item">
             <div className="info-container">
                <AiOutlineCheckCircle className="tick-icon" /> {/* Tick Icon */}
                <p> {task.title}</p>  
            </div>

            <div className="icon-container">
                <button className='edit'><AiOutlineEdit /> Edit</button> {/* Edit Icon */}
                <button className='delete'><AiOutlineDelete /> Delete</button> {/* Delete Icon */}
            </div>
        </div>
    )
}

export default ListItems;
