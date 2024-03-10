import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { FiUser } from 'react-icons/fi'; // Import the user icon from react-icons

const NavBar = ({ onSignOut }) => {
  const [profilePic, setProfilePic] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['AuthToken']);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await fetch('http://localhost:8000/user/profile-pic', {
          headers: {
            Authorization: `Bearer ${cookies.AuthToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile picture');
        }
        const data = await response.json();
        setProfilePic(data.profilePicUrl);
      } catch (error) {
        console.error(error);
      }
    };

    if (cookies.AuthToken) {
      fetchProfilePic();
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
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <FiUser className="user-icon" />
            )}
          </div>
          <div className="button-container">
            <button className="signout" onClick={onSignOut}>Sign Out</button>
          </div>
        </div>
      ) : (
        <div className="button-container">
          
        </div>
      )}
    </nav>
  );
}

export default NavBar;
