import React from 'react';
import './ProfileInfo.css';
import { useAuth } from '../Contexts/AuthContext';

function ProfileInfo({ user }) { // Assuming `user` prop contains all user data; adjust based on your data fetching strategy
  // Placeholder for state hooks if you're fetching data within this component
  // const [allergies, setAllergies] = useState([]);
  // const [preferences, setPreferences] = useState([]);
  // const [bmrData, setBmrData] = useState({});

  // Example data fetching function (you'll need to implement actual fetching logic)
  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  // const fetchUserData = async () => {
  //   // Fetch and set allergies, preferences, and BMR data
  // };
  const {authUser,setAuthUser,isLoggedIn,setIsLoggedIn} = useAuth();

  return (
    <div className="profile-info">
      <h2>Profile Information</h2>
      <div className="user-details">
        <h3>Basic Details</h3>
        <p>Email: rohan.k.bhatia@vanderbilt.edu</p>
        {/* Add more user details as needed */}
      </div>

      {/* <div className="allergies">
        <h3>Allergies</h3>
        <ul>
          {user.allergies.map((allergy, index) => (
            <li key={index}>{allergy}</li>
          ))}
        </ul>
      </div>

      <div className="preferences">
        <h3>Preferences</h3>
        <ul>
          {user.preferences.map((preference, index) => (
            <li key={index}>{preference}</li>
          ))}
        </ul>
      </div>

      <div className="bmr-data">
        <h3>BMR and Fitness Goals</h3>
        <p>Height: {user.bmrData.height} cm</p>
        <p>Weight: {user.bmrData.weight} kg</p>
        <p>Fitness Goal: {user.bmrData.fitnessGoal}</p>
        <p>Calories/day: {user.bmrData.calories}</p>
        {/* Include additional BMR-related data as needed}
      </div> */}
    </div>
  );
}

export default ProfileInfo;
