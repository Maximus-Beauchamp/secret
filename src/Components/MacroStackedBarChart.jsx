import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { day: 'Monday', Protein: 200, Fat: 100, Carbs: 300 },
    { day: 'Tuesday', Protein: 150, Fat: 150, Carbs: 200 },
    { day: 'Wednesday', Protein: 180, Fat: 120, Carbs: 220 },
    { day: 'Thursday', Protein: 200, Fat: 100, Carbs: 250 },
    { day: 'Friday', Protein: 170, Fat: 130, Carbs: 270 },
    { day: 'Saturday', Protein: 160, Fat: 140, Carbs: 260 },
    { day: 'Sunday', Protein: 180, Fat: 110, Carbs: 240 },
];

const StackedBarChartComponent = () => (
    <div style={{ width: '100%' }}> {/* Set a fixed height for the container */}
        <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Daily Macronutrient Distribution</h2>
        <ResponsiveContainer width="100%" height={400}> {/* Adjust the height percentage to allocate space for title and legend */}
            <BarChart
                data={data}
                margin={{
                    top: 20, // Increase top margin to ensure space for the title
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

export default StackedBarChartComponent;