import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Monday', calories: 2700 },
  { day: 'Tuesday', calories: 2200 },
  { day: 'Wednesday', calories: 2650 },
  { day: 'Thursday', calories: 2400 },
  { day: 'Friday', calories: 3000 },
  { day: 'Saturday', calories: 2300 },
  { day: 'Sunday', calories: 2900 },
];

const caloricGoal = 2500; // Example caloric goal

const maxCalories = Math.max(...data.map(entry => entry.calories), caloricGoal);
const minCalories = Math.min(...data.map(entry => entry.calories), caloricGoal);
const padding = 200; // Adjust as needed to provide padding

// Create data for the red line (caloric goal)
const caloricGoalData = data.map(({ day }) => ({ day, calories: caloricGoal }));

const DailyCaloricIntakeChart = () => (
  <div style={{ width: '100%', height: '100%' }}>
    <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Daily Caloric Intake</h2>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // Adjust margins as needed
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={{ dy: 10 }} /> {/* Adjust label position */}
        <YAxis domain={[minCalories - padding, maxCalories + padding]} label={{ value: 'Calories', angle: -90, position: 'insideLeft', offset: 10 }} />
        <Tooltip />
        <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
        <Line type="monotone" data={caloricGoalData} dataKey="calories" stroke="red" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default DailyCaloricIntakeChart;