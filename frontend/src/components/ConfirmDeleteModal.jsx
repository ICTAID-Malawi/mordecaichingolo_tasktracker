import React, { useRef, useEffect, useState } from 'react';

const ConfirmDeleteModal = ({ show, onCancel, onConfirm, anchorElement }) => {
    const [modalStyle, setModalStyle] = useState({});

    useEffect(() => {
        if (anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            setModalStyle({
                top: rect.bottom + window.scrollY + 'px',
                left: rect.left + window.scrollX + 'px'
            });
        }
    }, [anchorElement]);

    if (!show) return null;

    return (
        <div className={`confirm-delete-modal ${show ? 'show' : ''}`} style={modalStyle}>
            <p>Are you sure you want to delete this task?</p>
            <div className="button-container">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm}>Delete</button>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
