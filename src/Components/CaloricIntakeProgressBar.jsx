import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../Contexts/AuthContext';

const ProgressBar = () => {
    const [currentIntake, setCurrentIntake] = useState(0);
    const [goal, setGoal] = useState(0); // Dynamic goal based on BMR

    const storedAuthUser = localStorage.getItem('authUser')
    const username = storedAuthUser ? JSON.parse(storedAuthUser) : null;

    useEffect(() => {
        // Fetch the BMR for the logged-in user from the backend
        axios.get(`http://localhost:8081/bmr?username=${username.Name}`)
            .then(response => {
                setGoal(response.data.bmr);
            })
            .catch(error => {
                console.error("Failed to fetch BMR:", error);
            });

        // Fetch meal journal from local storage
        const savedJournal = JSON.parse(localStorage.getItem('mealJournal')) || [];

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        const total = savedJournal.reduce((sum, item) => sum + parseInt(item.macros.totalCalories.replace(' calories', ''), 10), 0);
        setCurrentIntake(total);
    }, []);

    const barColor = currentIntake > goal ? 'red' : '#8884d8';

    const data = [
        { name: 'Caloric Intake', value: currentIntake },
    ];

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
                    <Bar dataKey="value" fill={barColor} background={{ fill: '#f0f0f0' }} stroke="black" />
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
