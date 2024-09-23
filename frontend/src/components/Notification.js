import React from 'react';
import '../styles/Notification.css';

function Notification({ message, onClose }) {
  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
}

export default Notification;
