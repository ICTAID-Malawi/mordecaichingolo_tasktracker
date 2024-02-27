import React from 'react'

const ListHeader = ({ListName}) => {

  const signOut = () => {
    console.log('Signout')
  }
  return (
    <div className='list-header'>

      <h1>{ListName}</h1>
      <div className="button-container">
        <button className='create'>Add New</button>
        <button className='signout' onClick={signOut}>Signout</button>
      </div>

    </div>
  )
}

export default ListHeader;