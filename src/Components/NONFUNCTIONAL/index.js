const puppeteer = require('puppeteer');
const extractDiningHalls = require('./extractDiningHall'); // Ensure file names match your structure
const extractMealsOfTheDay = require('./extractMealsOfTheDay'); // Updated to include clicking on meals
// Assume extractMealTypes and extractMealItems have similar structure for integration

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = 'https://netnutrition.cbord.com/nn-prod/vucampusdining#new_tab';
    await page.goto(url);

    const diningHalls = await extractDiningHalls(page); // Extracts basic info about dining halls
    for (let hall of diningHalls) {
        console.log(`Processing ${hall.name}`);

        // Here, adjust the process to click into the dining hall if needed
        // This could involve a utility function similar to clickOnMealOfDay, adjusted for dining halls
        
        // Now, we use the updated extractMealsOfTheDay which includes clicking on each meal
        hall.mealsOfTheDay = await extractMealsOfTheDay(page); // Assumes this function now handles dynamic content
        for (let meal of hall.mealsOfTheDay) {
            console.log(`  Processing meal: ${meal.mealName}`);

            // Further processing for meal types and items would go here
            // This could involve additional utility functions for clicking through and extracting further details
            // Example:
            // meal.categories = await extractMealTypes(page, meal);
            // for (let type of meal.categories) {
            //     console.log(`    Processing type: ${type.name}`);
            //     type.items = await extractMealItems(page, type);
            // }
        }

        // Reset page state as necessary to allow for subsequent dining hall processing
        await page.goto(url); // Navigates back to the main page
        await page.waitForSelector('.card.unit'); // Waits for the main list to load again
    }
    
    console.log(JSON.stringify(diningHalls, null, 2)); // Outputs the final structured data
  //  await browser.close(); // Closes the browser when done
})();
