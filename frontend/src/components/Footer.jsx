import React from 'react';
import { useCookies } from 'react-cookie';

const Footer = () => {
  const [cookies] = useCookies(['Email']);

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2024 Warm up</p>
        <p>Contact: {cookies.Email}</p>
      </div>
    </footer>
  );
};

export default Footer;

