const fs = require('fs');

let hallsData;
try {
  const rawData = fs.readFileSync('hallsData.json');
  hallsData = JSON.parse(rawData);
} catch (error) {
  console.error('Error reading or parsing hallsData.json:', error);
}

const parseHallsData = (hallsData) => {
    const currentDate = new Date(2024, 3, 1).toLocaleDateString('en-US', { // Example date, adjust to use new Date() for current
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    return Object.entries(hallsData).map(([hallId, hallDetails]) => {
      const { status, data } = hallDetails;
      if (status !== "Open" || !data[currentDate]) return null; // Skip if hall is not operational or lacks data for today
  
      const mealsOfTheDay = Object.entries(data[currentDate]).map(([mealType, mealItems]) => {
        const items = mealItems.flatMap(mealItem =>
          Object.entries(mealItem).flatMap(([mealCategory, mealDetails]) =>
            Object.entries(mealDetails).map(([itemName, itemDetails]) => ({
              name: itemName,
              photo_url: `http://example.com/${itemName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
              calories_and_macros: {
                protein: itemDetails.macros.protein, 
                carbs: itemDetails.macros.carbs ,
                fat: itemDetails.macros.fat ,
                total_calories: parseInt(itemDetails.macros.totalCalories) + ' kcal', // Assuming conversion to integer kcal
              },
            }))
          )
        );
  
        return {
          type: mealType,
          items,
        };
      });
  
      return {
        name: hallId, // Use hallId directly as the name
        photo_url: `http://example.com/${hallId.toLowerCase()}.jpg`,
        mealsOfTheDay,
      };
    }).filter(hall => hall !== null); // Remove null entries for halls without data for today
  };
  
  
  // Assuming hallsData is already loaded with the JSON data
  const transformedData = parseHallsData(hallsData);
  console.log(JSON.stringify(transformedData, null, 2));
  