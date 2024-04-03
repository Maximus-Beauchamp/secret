import React from 'react';

const FoodItem = ({ details, addMealToJournal }) => {
  return (
    <div onClick={() => addMealToJournal(details)} style={{ cursor: 'pointer', margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <img src={details.photo_url} alt={details.name} style={{ maxWidth: '100px', height: 'auto' }} />
      <h3>{details.name}</h3>
      <p>Protein: {details.calories_and_macros.protein}</p>
      <p>Carbs: {details.calories_and_macros.carbs}</p>
      <p>Fat: {details.calories_and_macros.fat}</p>
      <p>Total Calories: {details.calories_and_macros.total_calories}</p>
    </div>
  );
};

export default FoodItem;
