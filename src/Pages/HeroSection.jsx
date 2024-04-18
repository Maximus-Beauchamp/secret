import React from 'react';
import './HeroSection.css'; // Ensures CSS styles are correctly applied
import { button } from '../Components/button';
import logo from '../Images/VUSMP_logo.webp';
import { Link, useNavigate, UNSAFE_useScrollRestoration } from 'react-router-dom'
import {useTrail, animated} from 'react-spring'

const HeroSection = () => {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate('/login');
  }
  
  return (
    <>
      <main>
          <div className="hero_container">
            <div className="hero_image">
              <img src={logo} alt="VUSMP Logo" />
            </div>
            <div className="hero_text">
              <h1>Its healthy made simple.</h1>
              <p>Eat smart. Live well. Plan with VUSMP.</p>
              <button 
                className="btn btn--primary btn-m" 
                onClick={handleLoginClick}
              >
                Sign Up
              </button>
            </div>
          </div>
      </main>
    </>
  );
};

export default HeroSection;