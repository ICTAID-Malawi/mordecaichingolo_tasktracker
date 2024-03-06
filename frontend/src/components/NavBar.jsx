import React, { useEffect, useState } from 'react';

const NavBar = ({ onSignOut }) => {
  const [initials, setInitials] = useState('');

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const response = await fetch('http://localhost:8000/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}` // Assuming you're using JWT for authentication
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user initials');
        }
        const data = await response.json();
        setInitials(data.initials);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitials();
  }, []);

  return (
    <nav className="navbar" >
      <div className="logo">
        <span className="logo-text">ICTAID</span>
      </div>
      <div className="button-user-container">
        <div className="user-info">
          <span className="initials">{initials}</span>
        </div>
        <div className="button-container">
          <button className="signout" onClick={onSignOut}>Sign Out</button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
