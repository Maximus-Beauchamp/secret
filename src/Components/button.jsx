import React, { useState } from 'react';
import './button.css';

const Button = ({ children, type, onClick, buttonStyle, buttonSize }) => {
  // Active state to toggle button style
  const [active, setActive] = useState(false);

  // Determine button style class
  const checkButtonStyle = buttonStyle || 'btn--primary'; // Default to primary if not specified
  // Determine button size class
  const checkButtonSize = buttonSize || 'btn-s'; // Default to small if not specified

  return (
    <button
      className={`btn ${checkButtonStyle} ${checkButtonSize} ${active ? 'active' : ''}`}
      onClick={() => {
        onClick();
        setActive(!active); // Toggle active state on click
      }}
      type={type}
    >
      {children}
    </button>
  );

};

export default Button;