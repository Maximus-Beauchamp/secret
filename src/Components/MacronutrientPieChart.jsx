import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const MacroNutrientPieChart = () => {
  const [macroData, setMacroData] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const mealData = JSON.parse(localStorage.getItem('mealJournal')) || [];

    const aggregatedData = mealData.reduce((acc, item) => {
      const proteinGrams = parseInt(item.macros.protein.replace('g', ''), 10);
      const fatGrams = parseInt(item.macros.fat.replace('g', ''), 10);
      const carbsGrams = parseInt(item.macros.carbs.replace('g', ''), 10);

      acc[0].grams += proteinGrams;
      acc[1].grams += fatGrams;
      acc[2].grams += carbsGrams;
      return acc;
    }, [
      { name: 'Protein', grams: 0 },
      { name: 'Fat', grams: 0 },
      { name: 'Carbs', grams: 0 },
    ]);

    setMacroData(aggregatedData);

    // Calculate total calories separately
    const total = mealData.reduce((sum, item) => sum + parseInt(item.macros.totalCalories.replace(' calories', ''), 10), 0);
    setTotalCalories(total);
  }, []);

  // CustomTooltip and renderCustomLabel remains unchanged
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


  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h2>Today's Macronutrient Pie Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={macroData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="grams"
            nameKey="name"
            label={renderCustomLabel}
          >
            {macroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'Protein' ? '#82ca9d' : entry.name === 'Fat' ? '#8884d8' : '#ffc658'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend align="center" verticalAlign="bottom" layout="horizontal" />
        </PieChart>
      </ResponsiveContainer>
      <p>Total Calories: {totalCalories}</p> {/* Display total calories correctly */}
    </div>
  );
};

export default MacroNutrientPieChart;
