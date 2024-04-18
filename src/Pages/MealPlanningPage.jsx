import React, { useState, useEffect } from 'react';
import DiningHallDetails from '../Components/DiningHallDetails';
import diningHallsData from '../Components/MealItems';
import { getMealJournal, addMealToJournal, clearMealJournal } from '../Components/MealJournalService';
import Notification from '../Components/Notification';
import './MealPlanningPage.css';

const MealPlanningPage = () => {
  const [mealJournal, setMealJournal] = useState(getMealJournal());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');  // Added to handle dynamic messages
  const [selectedHall, setSelectedHall] = useState(diningHallsData[0].name); // default to the first hall

  useEffect(() => {
    setMealJournal(getMealJournal());
  }, []);

  const addMealToJournalHandler = async (meal) => {
    try {
      await addMealToJournal(meal);
      const updatedJournal = getMealJournal();  // Re-fetch the updated journal
      setMealJournal(updatedJournal);
      setNotificationMessage(`Added ${meal.name} to your journal.`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (error) {
      console.error('Failed to add meal to journal:', error);
      setNotificationMessage('Failed to add meal to journal. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const handleClearJournal = () => {
    clearMealJournal().then(() => {
      setMealJournal([]);
      setNotificationMessage('Meal journal cleared.');  // Notification message for clearing the journal
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }).catch(error => {
      console.error('Failed to clear the meal journal:', error);
    });
  };

  const handleHallSelection = (hallName) => {
    setSelectedHall(hallName);
  };

  return (
    <div className="mealPlanning_container">
      <Notification message={notificationMessage} isVisible={showNotification} />
      <div className="tabs">
        {diningHallsData.map((hall, index) => (
          <button
            key={index}
            onClick={() => handleHallSelection(hall.name)}
            className={`tab ${selectedHall === hall.name ? 'active' : ''}`}
          >
            {hall.name}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <DiningHallDetails hallDetails={diningHallsData.find(hall => hall.name === selectedHall)} addMealToJournal={addMealToJournalHandler} />
      </div>
      <button onClick={handleClearJournal} className="mealPlanning_backButton">
        Clear Meal Journal
      </button>
    </div>
  );
};

export default MealPlanningPage;
