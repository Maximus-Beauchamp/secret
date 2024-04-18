import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const transformDataForChart = (mealData) => {
    // Initialize an object to hold the aggregated macronutrients for each day
    const aggregatedData = {
        // Assuming a structure where each day starts with zero macronutrients
        Monday: { Protein: 0, Fat: 0, Carbs: 0 },
        Tuesday: { Protein: 0, Fat: 0, Carbs: 0 },
        // Add similar entries for Wednesday through Sunday
    };

    // Iterate over mealData to aggregate macronutrients for each day
    mealData.forEach(item => {
        const dayOfWeek = item.day; // Assuming your meal data includes a 'day' property
        const macros = item.macros;
        if (aggregatedData[dayOfWeek]) {
            aggregatedData[dayOfWeek].Protein += parseInt(macros.protein.replace('g', ''), 10);
            aggregatedData[dayOfWeek].Fat += parseInt(macros.fat.replace('g', ''), 10);
            aggregatedData[dayOfWeek].Carbs += parseInt(macros.carbs.replace('g', ''), 10);
        }
    });

    // Transform aggregatedData into an array suitable for the BarChart component
    return Object.keys(aggregatedData).map(day => ({
        day,
        ...aggregatedData[day],
    }));
};

const StackedBarChartComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch meal data from local storage and transform it for the chart
        const mealData = JSON.parse(localStorage.getItem('mealJournal')) || [];
        const chartData = transformDataForChart(mealData);
        setData(chartData);
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Daily Macronutrient Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: 'Grams', angle: -90, position: 'insideLeft', offset: 10 }} />
                    <Tooltip />
                    <Legend align="center" verticalAlign="bottom" layout="horizontal"/>
                    <Bar dataKey="Protein" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Fat" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="Carbs" stackId="a" fill="#ffc658" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StackedBarChartComponent;
