import React, { useContext } from 'react';
import { MealTotalsContext } from '../Contexts/MealTotalsContext'; // Adjust the import path as necessary
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer, Text } from 'recharts';

/*
Dynamic input of data from context
const data = [
  { name: 'Protein', grams: 200, caloriesPerGram: 4 },
  { name: 'Fat', grams: 100, caloriesPerGram: 9 },
  { name: 'Carbs', grams: 300, caloriesPerGram: 4 },
]; */

// This wasn't being used const totalCalories = data.reduce((acc, item) => acc + item.grams * item.caloriesPerGram, 0);

// Custom tooltip to display grams
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px' }}>
        <p>{`${payload[0].name} : ${payload[0].value}g`}</p>
      </div>
    );
  }

  return null;
};

// Custom label for rendering percentages inside the slices
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MacroNutrientPieChart = () => {
  // Use useContext to get the current macronutrient totals
  const { protein, fat, carbs } = useContext(MealTotalsContext); // Assuming these are the provided values

  // Adjust 'data' to use the values from context
  const data = [
    { name: 'Protein', grams: protein },
    { name: 'Fat', grams: fat },
    { name: 'Carbs', grams: carbs },
  ];

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h2>Today's Macronutrient Pie Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="grams"
            nameKey="name"
            label={renderCustomLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'Protein' ? '#82ca9d' : entry.name === 'Fat' ? '#8884d8' : '#ffc658'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend align="center" verticalAlign="bottom" layout="horizontal" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroNutrientPieChart;