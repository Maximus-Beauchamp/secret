const fs = require('fs');

let hallsData;
try {
  const rawData = fs.readFileSync('hallsData.json');
  hallsData = JSON.parse(rawData);
} catch (error) {
  console.error('Error reading or parsing hallsData.json:', error);
}

const parseHallsData = (hallsData) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return Object.entries(hallsData).map(([hallId, hallDetails]) => {
    const { status, data } = hallDetails;
    if (status !== "Open" || !data[currentDate]) return null;

    const mealsOfTheDay = [];

    Object.entries(data[currentDate]).forEach(([mealType, mealCategories]) => {
      const categoriesAndItems = []; // Initialize an array to hold the categories and their items

      mealCategories.forEach(category => {
        Object.entries(category).forEach(([categoryName, items]) => {
          const itemsArray = Object.entries(items).map(([itemName, itemDetails]) => ({
            name: itemName,
            photo_url: `http://example.com/${itemName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            macros: itemDetails.macros,
          }));

          categoriesAndItems.push({
            name: categoryName,
            items: itemsArray,
          });
        });
      });

      mealsOfTheDay.push({
        type: mealType,
        categories: categoriesAndItems,
      });
    });

    // Include the current date in the returned object for each hall
    return {
      name: hallId,
      date: currentDate, // Add the current date here
      mealsOfTheDay,
    };
  }).filter(hall => hall !== null);
};

const transformedData = parseHallsData(hallsData);
console.log(JSON.stringify(transformedData, null, 2));
