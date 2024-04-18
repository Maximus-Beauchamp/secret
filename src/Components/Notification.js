import React from 'react';

const Notification = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      color: 'black',
      padding: '10px 20px',
      borderRadius: '5px',
      fontSize: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      {message}
    </div>
  );
};

export default Notification;