import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const NavBar = ({ onSignOut }) => {
  const [initials, setInitials] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['AuthToken']);

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const response = await fetch('http://localhost:8000/user', {
          headers: {
            Authorization: `Bearer ${cookies.AuthToken}` // Use cookies instead of localStorage
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

    if (cookies.AuthToken) {
      fetchInitials();
    }
  }, [cookies.AuthToken]);

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-text">ICTAID</span>
      </div>
      {cookies.AuthToken ? (
        <div className="button-user-container">
          <div className="user-info">
            <span className="initials">{initials}</span>
          </div>
          <div className="button-container">
            <button className="signout" onClick={onSignOut}>Sign Out</button>
          </div>
        </div>
      ) : (
        <div className="button-container">
          <button className="login-button" >Log In</button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
