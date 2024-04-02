import React, { useState } from 'react';
import './bmrCalculator.css';
import { useAuth } from '../Contexts/AuthContext'; // Import useAuth
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BMRCalculator() {
  const {authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn} = useAuth();

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState(''); // Used for metric system
  const [feet, setFeet] = useState(''); // For imperial system
  const [inches, setInches] = useState(''); // For imperial system
  const [unit, setUnit] = useState('imperial');
  const [activityLevel, setActivityLevel] = useState('light');
  const [fitnessGoal, setFitnessGoal] = useState('build_muscle');
  const [result, setResult] = useState('');
  const [globalBmr, setBMR] = useState('');

  const navigate = useNavigate();

  const convertHeightToCm = () => {
    // Convert height from feet and inches to centimeters if imperial is selected
    if (unit === 'imperial') {
      const totalInches = (parseInt(feet) * 12) + parseInt(inches);
      return totalInches * 2.54; // 1 inch = 2.54 cm
    }
    return height; // If metric, height is already in cm
  };

  const postMetrics = (gender, age, height, weight, activityLevel, fitnessGoal, bmr) => {
    axios.post("http://localhost:8081/metrics", {
      authUser, // Ensure `authUser` is defined and contains necessary user identification information
      gender,
      age,
      height,
      weight,
      activity_level: activityLevel, // Make sure this is correctly set; it was NULL in your error
      fitness_goal: fitnessGoal,
      bmr
    })
      .then(res => {
        // Check if the response status indicates success
        if (res.status == 200) {
          console.log(res.status);
          setIsLoggedIn(true)
          setAuthUser({
            Name: authUser
          })
          navigate('/profile-info');
        } else {
          // Handle any specific case where status is returned but not success
          console.error(`Failed to add metrics: ${res.data.status || 'Please try again.'}`);
        }
      })
      .catch(err => {
        // Log or handle errors more specifically here, if possible
        // This could include handling HTTP status codes if `err.response` is available
        if (err.response) {
          // Server responded with a status code outside the 2xx range
          console.log(`Error posting metrics: ${err.response.status} ${err.response.data}`);
        } else if (err.request) {
          // The request was made but no response was received
          console.log(`Error posting metrics: No response received.`);
        } else {
          // Something happened in setting up the request that triggered an error
          console.log(`Error posting metrics: ${err.message}`);
        }
      });
  }

  const calculateBMR = (event) => {
    event.preventDefault();
    const heightInCm = convertHeightToCm();
    const weightInKg = unit === 'imperial' ? weight * 0.453592 : weight; // Convert lbs to kg if imperial
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
    }

    // Adjust BMR based on activity level
    if(activityLevel === 'sedentary') bmr *= 1.2;
    else if(activityLevel === 'light') bmr *= 1.375;
    else if(activityLevel === 'moderate') bmr *= 1.55;
    else if(activityLevel === 'very') bmr *= 1.725;
    else if(activityLevel === 'super') bmr *= 1.9;
    
    setBMR(Math.floor(bmr));
    // Use bmr directly for immediate use
    postMetrics(gender, age, heightInCm, weightInKg, activityLevel, fitnessGoal, Math.floor(bmr));
    // Use bmr directly here as well
    setResult(`Your daily calorie needs based on activity level is ${Math.floor(bmr)} calories/day.`);


  };

  return (
    <div className='bmr-calculator'>
      <h2>STEP 2: BMR Calculator</h2>
      <form>
        {/* Gender */}
        <label htmlFor="gender">Gender:</label>
        <select id="gender" value={gender} onChange={(e) => {
          console.log(e.target.value); // Check what value is being received
          setGender(e.target.value);
        }} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>


        {/* Age */}
        <label htmlFor="age">Age (years):</label>
        <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} required /><br />

        {/* Unit */}
        <label htmlFor="unit">Unit:</label>
        <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="metric">Metric (kg, cm)</option>
          <option value="imperial">Imperial (lbs, ft/in)</option>
        </select><br />

        {/* Weight */}
        <label htmlFor="weight">Weight ({unit === 'metric' ? 'kg' : 'lbs'}):</label>
        <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required /><br />

        {/* Height - Conditional Rendering */}
        {unit === 'metric' ? (
          <>
            <label htmlFor="height">Height (cm):</label>
            <input type="number" id="height" value={height} onChange={(e) => setHeight(e.target.value)} required /><br />
          </>
        ) : (
          <>
            <label htmlFor="feet">Height:</label>
            <input type="number" id="feet" placeholder="Feet" value={feet} onChange={(e) => setFeet(e.target.value)} required />
            <input type="number" id="inches" placeholder="Inches" value={inches} onChange={(e) => setInches(e.target.value)} required /><br />
          </>
        )}

        {/* Activity Level */}
        <label htmlFor="activityLevel">Activity Level:</label>
        <select id="activityLevel" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} required>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
          <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
          <option value="very">Very active (hard exercise/sports 6-7 days a week)</option>
          <option value="super">Super active (very hard exercise/sports & a physical job or 2x training)</option>
        </select>

        {/* Goal Selection Functionality*/}
        <label htmlFor="primaryGoal">Primary Goal:</label>
        <select id="primaryGoal" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} required >
          <option value="loose_weight">Lose Weight</option>
          <option value="build_muscle">Build Muscle </option>
          <option value="recomp">Recomposition </option>
          <option value="maintain">Maintain Current Weight</option>
          <option value="improve_overall">Improve Overall Health and Fitness</option>
        </select>
        <button className='bmr-calculator' onClick={calculateBMR}>Calculate Daily Calorie Needs</button>
        {/* Additional Goal Button
        <div>
         <h2>Primary Goal Selection:</h2>
         <button onClick={() => handleGoalSelection('Lose Weight')}>Lose Weight</button>
         <button onClick={() => handleGoalSelection('Build Muscle')}>Build Muscle</button>
         <button onClick={() => handleGoalSelection('Recomposition')}>Recomposition (Losing fat while gaining muscle)</button>
         <button onClick={() => handleGoalSelection('Maintain Current Weight')}>Maintain Current Weight</button>
         <button onClick={() => handleGoalSelection('Improve Overall Health and Fitness')}>Improve Overall Health and Fitness</button>
        </div> */}
      </form>
      <p>{result}</p>
    </div>
  );
}

export default BMRCalculator;
