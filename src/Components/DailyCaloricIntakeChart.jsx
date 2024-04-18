import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DailyCaloricIntakeChart = () => {
  const [data, setData] = useState([
    { day: 'Monday', calories: 2700 },
    { day: 'Tuesday', calories: 2200 },
    { day: 'Wednesday', calories: 2650 },
    { day: 'Thursday', calories: 2400 },
    { day: 'Friday', calories: 3000 },
    { day: 'Saturday', calories: 2300 },
    { day: 'Sunday', calories: 2900 },
  ]);
  const [caloricGoal, setCaloricGoal] = useState(2500);  // Default value

  useEffect(() => {
    const storedAuthUser = localStorage.getItem('authUser')
    const username = storedAuthUser ? JSON.parse(storedAuthUser).Name : null;

    // Fetch the BMR for the logged-in user from the backend
    if (username) {
      axios.get(`http://localhost:8081/bmr?username=${encodeURIComponent(username)}`)
          .then(response => {
              setCaloricGoal(response.data.bmr);
          })
          .catch(error => {
              console.error("Failed to fetch BMR:", error);
          });
    }
  }, []);

  const maxCalories = Math.max(...data.map(entry => entry.calories), caloricGoal);
  const minCalories = Math.min(...data.map(entry => entry.calories), caloricGoal);
  const padding = 200; // Adjust as needed to provide padding

  // Create data for the red line (caloric goal)
  const caloricGoalData = data.map(({ day }) => ({ day, calories: caloricGoal }));

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Daily Caloric Intake</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ dy: 10 }} />
          <YAxis domain={[minCalories - padding, maxCalories + padding]} label={{ value: 'Calories', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
          <Line type="monotone" data={caloricGoalData} dataKey="calories" stroke="red" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyCaloricIntakeChart;
