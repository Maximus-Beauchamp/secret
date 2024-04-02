import React, { useState, useEffect } from 'react';
import DiningHall from '../Components/DiningHall';
import diningHallsData from '../Components/MealItems';
import { getMealJournal, addMealToJournal, MealJournalDisplay } from '../Components/MealJournalService'; 
import Notification from '../Components/Notification';


const MealPlanningPage = () => {
  const [mealJournal, setMealJournal] = useState(getMealJournal());
  const [showNotification, setShowNotification] = useState(false);
  const [visibleHall, setVisibleHall] = useState(null);

  useEffect(() => {
    // Refresh the meal journal from localStorage when the component mounts
    setMealJournal(getMealJournal());
  }, []);

  const addMealToJournalHandler = (meal) => {
    addMealToJournal(meal, (updatedJournal) => {
      setMealJournal(updatedJournal);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    });
  };

  return (
    <div>
      <h1>Meal Planning</h1>
      {diningHallsData.map((hall, index) => (
        <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2 onClick={() => setVisibleHall(visibleHall === hall.name ? null : hall.name)} style={{ cursor: 'pointer' }}>
            {hall.name}
          </h2>
          {visibleHall === hall.name && (
            <DiningHall hallDetails={hall} addMealToJournal={addMealToJournalHandler} />
          )}
        </div>
      ))}
      <Notification message="Food Logged" isVisible={showNotification} />
      <MealJournalDisplay mealJournal={mealJournal} />
    </div>
  );
};

export default MealPlanningPage;