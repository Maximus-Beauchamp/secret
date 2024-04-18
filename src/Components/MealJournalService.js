import axios from 'axios';

export const getMealJournal = () => {
  const savedJournal = localStorage.getItem('mealJournal');
  return savedJournal ? JSON.parse(savedJournal) : [];
};
const parseValue = (value) => {
  // Regex to remove any characters except digits and decimal points
  const numericValue = value.replace(/[^\d.]/g, '');
  
  // Handle values like "< 1"
  if (value.includes('<')) {
    return 0; // or some other small number close to zero if that better suits your business logic
  }
  
  return parseFloat(numericValue) || 0; // Convert to float, default to 0 if empty or invalid
};

export const calculateMealTotals = (meals) => {
  return meals.reduce((acc, meal) => {
    // Initialize macros to an empty object if undefined to prevent TypeError
    const macros = meal.macros || {};
    const protein = macros.protein && macros.protein.includes('<') ? '0g' : (macros.protein || '0g');
    const carbs = macros.carbs && macros.carbs.includes('<') ? '0g' : (macros.carbs || '0g');
    const fat = macros.fat && macros.fat.includes('<') ? '0g' : (macros.fat || '0g');
    // Check for '<' in totalCalories and ensure macros.totalCalories is defined
    const totalCalories = macros.totalCalories && macros.totalCalories.includes('<') ? '0 calories' : (macros.totalCalories || '0 calories');

    acc.calories += parseInt(totalCalories.replace(' calories', ''), 10) || 0;
    acc.protein += parseInt(protein.replace('g', ''), 10) || 0;
    acc.carbs += parseInt(carbs.replace('g', ''), 10) || 0;
    acc.fat += parseInt(fat.replace('g', ''), 10) || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
};


export const addMealToJournal = async (meal) => {
  const storedAuthUser = localStorage.getItem('authUser');
  const username = storedAuthUser ? JSON.parse(storedAuthUser) : {};
  const itemName = meal.name;
  const macros = meal.macros;

  // Parsing macro values to ensure they are clean before sending
  const protein = parseValue(macros.protein);
  const carbs = parseValue(macros.carbs);
  const fat = parseValue(macros.fat);
  const totalCalories = parseValue(macros.totalCalories);

  const dateOfEntry = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD

  // Update local storage first
  const mealJournal = JSON.parse(localStorage.getItem('mealJournal')) || [];
  mealJournal.push({ ...meal, dateOfEntry });
  localStorage.setItem('mealJournal', JSON.stringify(mealJournal));

  // Define the URL for the API call
  const apiUrl = 'http://localhost:8081/journal';

  // Define the payload for the API call
  const payload = {
    username: username.Name,
    itemName: itemName,
    macros: {
      protein: protein.toString() + 'g', // Convert back to string if necessary
      carbs: carbs.toString() + 'g',
      fat: fat.toString() + 'g',
      totalCalories: totalCalories.toString() + ' calories'
    },
    totalCalories: totalCalories.toString() + ' calories',
    dateOfEntry: dateOfEntry
  };

  console.log("Payload for API:", payload);

  // Push the entry to the database using Axios
  try {
      const response = await axios.post(apiUrl, payload);
      console.log('Meal journal entry added successfully:', response.data);
  } catch (error) {
      console.error('Error adding meal to journal:', error);
      // Handle error appropriately
  }
};


export const clearMealJournal = async () => {
  const storedAuthUser = localStorage.getItem('authUser');
  const username = storedAuthUser ? JSON.parse(storedAuthUser).Name : null;

  if (!username) {
    console.error('No user logged in');
    return Promise.reject(new Error('No user logged in'));
  }

  try {
    await axios.delete(`http://localhost:8081/clear-journal?username=${encodeURIComponent(username)}`);
    localStorage.removeItem('mealJournal'); // Clear the local storage
    return Promise.resolve();
  } catch (error) {
    console.error('Error clearing meal journal:', error);
    return Promise.reject(error);
  }
};

const groupMealsByDate = (meals) => {
  const grouped = meals.reduce((acc, meal) => {
    // Use toLocaleDateString with options for "Month Day, Year" format
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = meal.dateOfEntry ? new Date(meal.dateOfEntry).toLocaleDateString('en-US', dateOptions) : 'Unknown Date';

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {});

  // Sort the dates in descending order (most recent first)
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  // Return an array of { date, meals } objects for easier iteration
  return sortedDates.map(date => ({
    date,
    meals: grouped[date],
  }));
};


export const MealJournalDisplay = ({ mealJournal }) => {
  const groupedMeals = groupMealsByDate(mealJournal);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '80%',
      margin: '0 auto'
    }}>
      <h2>FOOD JOURNAL</h2>
      {groupedMeals.map((group, index) => (
        <div key={index} style={{ width: '100%', marginBottom: '20px' }}>
          <h3 style={{ textAlign: 'center', margin: '20px 0' }}>{group.date}</h3>
          <table style={{
            borderCollapse: 'collapse',
            margin: '0 auto',
            width: '100%',
            tableLayout: 'fixed'
          }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {group.meals.map((meal, mealIndex) => (
                <tr key={mealIndex}>
                  <td>{meal.name}</td>
                  <td>{meal.macros.protein}</td>
                  <td>{meal.macros.carbs}</td>
                  <td>{meal.macros.fat}</td>
                  <td>{meal.macros.totalCalories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

