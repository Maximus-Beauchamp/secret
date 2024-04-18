import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileInfo.css';

function ProfileInfo() {
  const { isLoggedIn } = useAuth();
  const [userData, setUserData] = useState({
    login: {},
    allergies: [],
    preferences: [],
    metrics: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to retrieve the authUser from localStorage
    const storedAuthUser = localStorage.getItem('authUser');
    const authUser = storedAuthUser ? JSON.parse(storedAuthUser) : null;

    if (!isLoggedIn || !authUser) {
      // User is not logged in or authUser data is not available yet
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use authUser.Name from localStorage
        console.log(storedAuthUser);
        console.log(authUser);
        const response = await axios.get(`http://localhost:8081/profile-info?username=${encodeURIComponent(authUser.Name)}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Fetching error:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Removed authUser dependency to rely on localStorage directly


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Functions for navigating to edit pages
  const editLoginInfo = () => navigate('/editPassword');
  const editAllergiesAndPreferences = () => navigate('/profile');
  const editMetrics = () => navigate('/bmrCalculator');

  const cmToFeetInches = (cm) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}' ${remainingInches}"`; // Returns a string formatted as feet and inches
  };

  const renderMetricsTable = (metrics) => {
    if (metrics.length === 0) {
      return null;
    }

    // Exclude 'id' and include conversion for 'height'
    const metricKeys = Object.keys(metrics[0]).filter(key => key !== 'id');

    return (
      <table className="metrics-table">
        <thead>
          <tr>
            {metricKeys.map(key => (
              <th key={key}>{key.replace('_', ' ').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={index}>
              {metricKeys.map((key, i) => (
                <td key={i}>
                  {key === 'height' ? cmToFeetInches(metric[key]) : metric[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (!isLoggedIn) {
    // Display options for new users or users not logged in
    return (
      <div className="profile-info">
        <h2>Welcome to VUSMP!</h2>
        <div className="step-container">
          <h3>Step 1: Enter Allergies and Preferences</h3>
          <h3>Step 2: Enter Measurables and Fitness Goals</h3>
          <button onClick={editAllergiesAndPreferences}>Get Started!</button>
        </div>
      </div>
    );
  } else {
    // Display profile information for logged in users
    return (
      <div className="profile-info">
        <h2>Profile Information</h2>

        <div className="section-container">
          <h3>Login Info</h3>
          <p>Username: {userData.login.username}</p>
          <button onClick={editLoginInfo}>Edit Password</button>
        </div>

        <div className="section-container">
          <h3>Allergies and Preferences</h3>
          {userData.allergies.map(allergy => (
            <p key={allergy.id}>Allergy: {allergy.allergy}</p>
          ))}
          {userData.preferences.map(preference => (
            <p key={preference.id}>Preference: {preference.preference}</p>
          ))}
          <button onClick={editAllergiesAndPreferences}>Edit Preferences & Allergies</button>
        </div>

        <div className="section-container">
            <h3>Metrics</h3>
            {renderMetricsTable(userData.metrics)}
            <button onClick={editMetrics}>Edit Metrics</button>
          </div>
      </div>
    );
  }
}

export default ProfileInfo;
