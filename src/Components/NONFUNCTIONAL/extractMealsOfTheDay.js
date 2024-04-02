const { clickOnMealOfDay } = require('./utils');

async function extractMealsOfTheDay(page) {
    // Extract meals of the day and their respective onclick attributes for identification
    const meals = await page.evaluate(() => {
        const mealData = [];
        const mealElements = document.querySelectorAll('.cbo_nn_menuLinkCell a.cbo_nn_menuLink');
        mealElements.forEach((mealElement) => {
            const mealName = mealElement.innerText.trim();
            const onclickAttr = mealElement.getAttribute('onclick');
            const mealIdMatch = onclickAttr.match(/menuListSelectMenu\((\d+)\)/);
            if (mealIdMatch && mealIdMatch[1]) {
                const mealId = mealIdMatch[1];
                mealData.push({ mealName, mealId });
            }
        });
        return mealData;
    });

    // Iterate through each meal and trigger the onclick event to load more details
    for (const meal of meals) {
        // Utilize the mealId to perform a click, triggering dynamic content load
        await clickOnMealOfDay(page, meal.mealId);
        
        // Wait for the dynamic content to load after clicking on the meal
        // Adjust this selector based on your page's content
        await page.waitForSelector('.details-loaded-indicator', { timeout: 5000 });
        
        // Optional: Extract additional meal details here if needed
        // This could involve another page.evaluate to parse the newly loaded content
        // Example: meal.details = await extractMealDetails(page, meal);
    }

    return meals; // Return the extracted meals with their names and IDs (and potentially more details)
}

module.exports = extractMealsOfTheDay;
