import React, { useState, useEffect } from 'react';
import DiningHallDetails from '../Components/DiningHallDetails'; // Adjust the import path as necessary
import diningHallsData from '../Components/MealItems';
import { getMealJournal, addMealToJournal, MealJournalDisplay } from '../Components/MealJournalService'; 
import Notification from '../Components/Notification';

const MealPlanningPage = () => {
  const [mealJournal, setMealJournal] = useState(getMealJournal());
  const [showNotification, setShowNotification] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);

  useEffect(() => {
    setMealJournal(getMealJournal());
  }, []);

  const addMealToJournalHandler = (meal) => {
    addMealToJournal(meal, (updatedJournal) => {
      setMealJournal(updatedJournal);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    });
  };

  const handleHallSelection = (hallName) => {
    const hall = diningHallsData.find(hall => hall.name === hallName);
    setSelectedHall(hall);
  };

  const handleBackToList = () => {
    setSelectedHall(null);
  };

  return (
    <div>
      {selectedHall ? (
        <>
          <button onClick={handleBackToList} style={{ margin: '10px', padding: '5px' }}>Back to Halls List</button>
          <DiningHallDetails hallDetails={selectedHall} addMealToJournal={addMealToJournalHandler} />
        </>
      ) : (
        <>
          <h1>Meal Planning</h1>
          {diningHallsData.map((hall, index) => (
            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h2 onClick={() => handleHallSelection(hall.name)} style={{ cursor: 'pointer' }}>
                {hall.name}
              </h2>
            </div>
          ))}
        </>
      )}
      <Notification message="Food Logged" isVisible={showNotification} />
      <MealJournalDisplay mealJournal={mealJournal} />
    </div>
  );
};

export default MealPlanningPage;
