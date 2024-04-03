export const getMealJournal = () => {
  const savedJournal = localStorage.getItem('mealJournal');
  return savedJournal ? JSON.parse(savedJournal) : [];
};

export const calculateMealTotals = (meals) => {
  return meals.reduce((acc, meal) => {
    // Check for "<1g" and similar patterns, treating them as "0g" for calculation purposes
    const protein = meal.macros.protein.includes('<') ? '0g' : meal.macros.protein;
    const carbs = meal.macros.carbs.includes('<') ? '0g' : meal.macros.carbs;
    const fat = meal.macros.fat.includes('<') ? '0g' : meal.macros.fat;
    const totalCalories = meal.macros.totalCalories.includes('<') ? '0 calories' : meal.macros.totalCalories;

    acc.calories += parseInt(totalCalories.replace(' calories', ''), 10);
    acc.protein += parseInt(protein.replace('g', ''), 10);
    acc.carbs += parseInt(carbs.replace('g', ''), 10);
    acc.fat += parseInt(fat.replace('g', ''), 10);
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
};

export const MealJournalDisplay = ({ mealJournal }) => {
  return (
    <div>
      <h2>FOOD JOURNAL</h2>
      <ul>
        {mealJournal.map((meal, index) => (
          <li key={index}>
            {meal.name} - {meal.macros.totalCalories} calories
          </li>
        ))}
      </ul>
    </div>
  );
};
