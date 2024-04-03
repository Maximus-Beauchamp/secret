import React, { useState } from 'react';
import './ItemComponentsStyle.css';

const ItemComponent = ({ item, addMealToJournal }) => {
    const [isNutritionVisible, setIsNutritionVisible] = useState(false);
  
    return (
      <div className="itemContainer">
        <h4 onClick={() => setIsNutritionVisible(!isNutritionVisible)} className="itemName">
          {item.name}
        </h4>
        {isNutritionVisible && (
          <div className="dropdownContent">
            {/* Nutritional information */}
            <p>Protein: {item.macros.protein}</p>
            <p>Carbs: {item.macros.carbs}</p>
            <p>Fat: {item.macros.fat}</p>
            <p>Total Calories: {item.macros.totalCalories}</p>
          </div>
        )}
        <button onClick={() => addMealToJournal(item)} className="addButton">
          Add to Journal
        </button>
      </div>
    );
  };

const MealComponent = ({ name, items, addMealToJournal }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)} style={{ display: 'block', width: '100%', marginBottom: '10px' }}>
        {name}
      </button>
      {isVisible && (
        <div>
          {items.map((item, index) => (
            <ItemComponent key={index} item={item} addMealToJournal={addMealToJournal} />
          ))}
        </div>
      )}
    </div>
  );
};

const DiningHallDetails = ({ hallDetails, addMealToJournal }) => {
  return (
    <div className="diningHallDetails">
      <h2>{hallDetails.name}</h2>
      {hallDetails.mealsOfTheDay.map((mealType, index) => (
        <div key={index} className="mealTypeContainer">
          <h3>{mealType.type}</h3>
          {mealType.categories.map((category, subIndex) => (
            <MealComponent key={subIndex} name={category.name} items={category.items} addMealToJournal={addMealToJournal} />
          ))}
        </div>
      ))}
    </div>
  );
};


export default DiningHallDetails;
