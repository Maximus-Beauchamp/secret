import React, { useState } from 'react';

// Meal Type Button Component
const MealTypeButton = ({ type, onClick }) => (
  <button onClick={onClick} style={{ margin: '5px', padding: '10px', display: 'block', width: '100%' }}>
    {type}
  </button>
);

// Nutritional Information Component
const NutritionalInfo = ({ calories_and_macros }) => (
  <div style={{ textAlign: 'center' }}>
    <p>Protein: {calories_and_macros.protein}</p>
    <p>Carbs: {calories_and_macros.carbs}</p>
    <p>Fat: {calories_and_macros.fat}</p>
    <p>Total Calories: {calories_and_macros.total_calories}</p>
  </div>
);

// Meal Item Component
const MealItem = ({ item, onAddMealToJournal, toggleNutritionVisibility, isVisible }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
    <div style={{ cursor: 'pointer' }} onClick={() => toggleNutritionVisibility(item.name)}>
      <h4>{item.name}</h4>
      {isVisible && <NutritionalInfo calories_and_macros={item.calories_and_macros} />}
    </div>
    <button onClick={() => onAddMealToJournal(item)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>
      Add to Journal
    </button>
  </div>
);

const DiningHall = ({ hallDetails, addMealToJournal }) => {
  const [visibleMealType, setVisibleMealType] = useState(null);
  const [visibleNutritionDetails, setVisibleNutritionDetails] = useState({});

  const toggleMealTypeVisibility = (type) => {
    setVisibleMealType(visibleMealType === type ? null : type);
  };

  const toggleNutritionVisibility = (itemName) => {
    setVisibleNutritionDetails(prevState => ({
      ...prevState,
      [itemName]: !prevState[itemName]
    }));
  };

  return (
    <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      {hallDetails.mealsOfTheDay.map((mealType, index) => (
        <div key={index}>
          <MealTypeButton type={mealType.type} onClick={() => toggleMealTypeVisibility(mealType.type)} />
          {visibleMealType === mealType.type && (
            mealType.items.map((item, itemIndex) => (
              <MealItem key={itemIndex} item={item} onAddMealToJournal={addMealToJournal} toggleNutritionVisibility={toggleNutritionVisibility} isVisible={!!visibleNutritionDetails[item.name]} />
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default DiningHall;
