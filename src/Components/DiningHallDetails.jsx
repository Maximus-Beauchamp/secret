import React, { useState, useEffect } from 'react';
import './ItemComponentStyle.css';
import MakeOpenAIRequest from './AI';
import {useAuth} from "../Contexts/AuthContext"

const ItemComponent = ({ item, addMealToJournal }) => {
  const [isNutritionVisible, setIsNutritionVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(false);  // State to control notification visibility
  const [aiRecommendation, setAiRecommendation] = useState("");

  const handleAddToJournal = () => {
    addMealToJournal(item);
    setShowNotification(true);  // Show the notification
    setTimeout(() => {
      setShowNotification(false);  // Automatically hide the notification after 2 seconds
    }, 2000);
  };

  const handleAIRecommendation = () => {
    const prompt = `Given a person's goal to maintain health, evaluate this meal: ${item.name} which has ${item.macros.protein} protein, ${item.macros.carbs} carbs, ${item.macros.fat} fat, and totals ${item.macros.totalCalories}.`;

    MakeOpenAIRequest(prompt)
      .then(response => {
        setAiRecommendation(response);  // Save the AI recommendation to state
        console.log("AI Recommendation:", response);
      })
      .catch(error => {
        console.error("Error getting AI recommendation:", error);
        setAiRecommendation("Failed to get AI recommendation.");  // Handle error appropriately
      });
  };

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
          {aiRecommendation && <p>AI Suggestion: {aiRecommendation}</p>}
        </div>
      )}
      <button onClick={handleAddToJournal} className="addButton">
        Add to Journal
      </button>
      <button onClick={handleAIRecommendation} className="aiButton">
        Get AI Suggestion
      </button>
      {showNotification && <div className="notification">Item Added!</div>}
    </div>
  );
};

const MealComponent = ({ name, items, addMealToJournal, isVisible, onVisibilityChange }) => {
  const [justMadeVisible, setJustMadeVisible] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");

  const handleClick = () => {
      const becomingVisible = !isVisible;
      onVisibilityChange();  // This should toggle the visibility
      setJustMadeVisible(becomingVisible);
  };

  useEffect(() => {
      if (justMadeVisible) {
          const mealItemsWithMacros = items.map(item => ({
              name: item.name,
              protein: item.macros.protein,
              carbs: item.macros.carbs,
              fat: item.macros.fat,
              totalCalories: item.macros.totalCalories
          }));

          console.log(`Meal Items for ${name}:`, mealItemsWithMacros);
          setJustMadeVisible(false); // Reset the flag after logging

          const prompt = `Given the goal to maintain health, out of the following meals, suggest the best meal considering nutrition: ${mealItemsWithMacros.map(item => `${item.name} with protein: ${item.protein}, carbs: ${item.carbs}, fat: ${item.fat}, total calories: ${item.totalCalories}`).join('; ')}.`;

          MakeOpenAIRequest(prompt)
              .then(response => {
                  console.log("AI Recommendation:", response);
                  setAiRecommendation(response);  // Save the AI recommendation to state
              })
              .catch(error => {
                  console.error("Error getting AI recommendation:", error);
                  setAiRecommendation("Failed to get AI recommendation.");  // Handle error appropriately
              });
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
                  <p>{aiRecommendation}</p> {/* Display the AI recommendation */}
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