import React, { useState } from 'react';
import Modal from './Modal';

const ListHeader = ({ ListName, getData }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className='list-header'>
            <h1>{ListName}</h1>
            <div className="button-container">
                <button className='create' onClick={() => setShowModal(true)}>Add New</button>
            </div>
            {showModal && <Modal mode={'Create'} setShowModal={setShowModal} getData={getData} />}
        </div>
    );
};

export default ListHeader;
