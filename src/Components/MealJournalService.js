export const getMealJournal = () => {
  const savedJournal = localStorage.getItem('mealJournal');
  return savedJournal ? JSON.parse(savedJournal) : [];
};

export const calculateMealTotals = (meals) => {
  return meals.reduce((acc, meal) => {
    acc.calories += parseInt(meal.calories_and_macros.total_calories.replace(' kcal', ''), 10);
    acc.protein += parseInt(meal.calories_and_macros.protein.replace('g', ''), 10);
    acc.carbs += parseInt(meal.calories_and_macros.carbs.replace('g', ''), 10);
    acc.fat += parseInt(meal.calories_and_macros.fat.replace('g', ''), 10);
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
};

export const addMealToJournal = (meal, callback) => {
  const savedJournal = getMealJournal();
  const updatedJournal = [...savedJournal, meal];
  localStorage.setItem('mealJournal', JSON.stringify(updatedJournal));

  // Calculate the new totals based on the updated journal
  const totals = calculateMealTotals(updatedJournal);

  // Use the callback to pass back both the updated journal and the new totals
  callback(updatedJournal, totals);
  console.log(updatedJournal)
  console.log(totals)
};

export const MealJournalDisplay = ({ mealJournal }) => {
  return (
    <div>
      <h2>FOOD JOURNAL</h2>
      <ul>
        {mealJournal.map((meal, index) => (
          <li key={index}>{meal.name} - {meal.calories_and_macros.total_calories} calories</li>
        ))}
      </ul>
    </div>
  );
};