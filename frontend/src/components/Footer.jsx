import React from 'react';
import { useCookies } from 'react-cookie';

const Footer = () => {
  const [cookies] = useCookies(['Email']);

  return (
    <footer className="footer" style={{ backgroundColor: '#353535', padding: '20px', textAlign: 'center', borderTop: '1px solid #ccc', marginTop: '20px' }}>
      <div className="footer-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: '0' }}>&copy; 2024 Warm up</p>
        <p style={{ margin: '0', marginTop: '10px' }}>Contact: {cookies.Email}</p>
      </div>
    </footer>
  );
};

export default Footer;
