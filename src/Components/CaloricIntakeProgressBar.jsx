import React, { useContext } from 'react';
import { MealTotalsContext } from '../Contexts/MealTotalsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const ProgressBar = () => {
    const { calories: currentIntake } = useContext(MealTotalsContext);
    const goal = 2500; // Example goal
    const barColor = currentIntake > goal ? 'red' : '#8884d8';
    const backgroundColor = '#f0f0f0'; // Background color of the bar
    const outlineColor = 'black'; // Outline color of the bar

    const data = [
        { name: 'Caloric Intake', value: currentIntake },
    ];

    // Custom tooltip formatter function
    const tooltipFormatter = (value, name, props) => {
        const caloriesDifference = currentIntake - goal;
        if (caloriesDifference > 0) {
            return `${caloriesDifference} Calories Over`;
        } else if (caloriesDifference < 0) {
            return `${Math.abs(caloriesDifference)} Calories Left`;
        } else {
            return 'On Track';
        }
    };

    return (
        <div className="progress-bar-container">
            <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Today's Caloric Intake Progress</h2>
            <ResponsiveContainer width="100%" height={100}>
                <BarChart 
                    data={data} 
                    layout="vertical" 
                >
                    <XAxis type="number" domain={[0, goal]} hide={true} />
                    <YAxis type="category" dataKey="name" hide={true} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Bar dataKey="value" fill={barColor} background={{ fill: backgroundColor }} stroke={outlineColor} />
                </BarChart>
            </ResponsiveContainer>
            <div className="progress-info">
                <span>Today's Intake: {currentIntake} calories</span>
                <br />
                <span>Goal: {goal} calories</span>
                
            </div>
        </div>
    );
};

export default ProgressBar;