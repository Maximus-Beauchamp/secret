import React, { useState, useEffect } from 'react';
import './ItemComponentsStyle.css';
import makeOpenAIRequest from "./AI"

const ItemComponent = ({ item, addMealToJournal }) => {
  const [isNutritionVisible, setIsNutritionVisible] = useState(false);

  return (
    <div className="itemContainer">
      <h4 onClick={() => setIsNutritionVisible(!isNutritionVisible)} className="itemName">
        {item.name}
      </h4>
      {isNutritionVisible && (
        <div className="nutritionContent">
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

const MealComponent = ({ name, items, addMealToJournal, isVisible, onVisibilityChange }) => {
  // State to track if the component was just made visible
  const [justMadeVisible, setJustMadeVisible] = useState(false);

  // Function to handle visibility change and log items if becoming visible
  const handleClick = () => {
    const becomingVisible = !isVisible;
    onVisibilityChange(); // Trigger visibility change
    setJustMadeVisible(becomingVisible); // Update state based on whether the component is becoming visible
  };

  // Effect hook to log items only once when the component becomes visible
  useEffect(() => {
    if (justMadeVisible) {
      const mealItemsWithMacros = items.map(item => ({
        name: item.name,
        protein: item.macros.protein,
        carbs: item.macros.carbs,
        fat: item.macros.fat,
        totalCalories: item.macros.totalCalories,
      }));
  
      console.log(`Meal Items for ${name}:`, mealItemsWithMacros);
      setJustMadeVisible(false); // Reset the flag after logging
  
      // Prepare the prompt
      const prompt = `Given the goal to build muscle, which of these meals would be best? ${mealItemsWithMacros.map(item => `${item.name} with protein: ${item.protein}, carbs: ${item.carbs}, fat: ${item.fat}, total calories: ${item.totalCalories}`).join('; ')}.`;
      console.log(prompt)
      // Assume an async function makeOpenAIRequest(prompt) that handles the API request
      makeOpenAIRequest(prompt).then(recommendation => {
        console.log("OpenAI Recommendation:", recommendation);
      }).catch(error => console.error("OpenAI Error:", error));
    }
  }, [justMadeVisible, items, name]);
  
  return (
    <div>
      <button onClick={handleClick} className="mealTypeButton">
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
  const [visibleMeal, setVisibleMeal] = useState({ type: null, category: null });

  const handleMealVisibilityChange = (type, category) => {
    setVisibleMeal({
      type: visibleMeal.type === type && visibleMeal.category === category ? null : type,
      category: visibleMeal.type === type && visibleMeal.category === category ? null : category
    });
  };

  return (
    <div className="diningHallDetails">
      <h2>{hallDetails.name}</h2>
      {hallDetails.mealsOfTheDay.map((mealType, index) => (
        <div key={index}>
          <h3>{mealType.type}</h3>
          {mealType.categories.map((category, subIndex) => (
            <MealComponent
              key={`${mealType.type}-${category.name}-${subIndex}`} // Unique key for each instance
              name={category.name}
              items={category.items}
              addMealToJournal={addMealToJournal}
              isVisible={category.name === visibleMeal.category && mealType.type === visibleMeal.type}
              onVisibilityChange={() => handleMealVisibilityChange(mealType.type, category.name)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};


export default DiningHallDetails;