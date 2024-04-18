const fs = require('fs');
const openNutritionLabelAndScrapeInfo = require('./openAndScrape');


async function getMealNamesAndOnClicks(page) {
    return await page.evaluate(() => {
      const meals = [];
      document.querySelectorAll('.cbo_nn_menuLink').forEach(element => {
        // Assuming the date is part of a structure close to this link, for example in a header
        const dateHeader = element.closest('.card').querySelector('.card-title').textContent.trim();
        meals.push({
          date: dateHeader,
          name: element.textContent.trim(),
          onClick: element.getAttribute('onclick')
        });
      });
      return meals;
    });
  }
  
async function navigateAndCollectNutritionalInfo(page, onClick) {
    await page.evaluate(onClickScript => eval(onClickScript), onClick);
    const nutritionalInfo = await openNutritionLabelAndScrapeInfo(page);
    return nutritionalInfo;
  }
  // Refactored function to handle data processing and file saving
async function processItemsAndSave(page, hallName) {
    const mealNamesAndOnClicks = await getMealNamesAndOnClicks(page);
    let mealsData = {};

    for (const meal of mealNamesAndOnClicks) {
        if (!mealsData[meal.date]) {
            mealsData[meal.date] = {};
        }
        if (!mealsData[meal.date][meal.name]) {
            mealsData[meal.date][meal.name] = [];
        }

        console.log(`Processing: ${meal.date} - ${meal.name} in ${hallName}`);
        const nutritionalInfo = await navigateAndCollectNutritionalInfo(page, meal.onClick);
        mealsData[meal.date][meal.name].push(nutritionalInfo);
    }

    // Here, optionally close the dropdown if needed
    await page.evaluate(() => {
        const dropdownToggle = document.querySelector('#dropdownDateButton');
        if (dropdownToggle && dropdownToggle.getAttribute('aria-expanded') === 'true') {
            dropdownToggle.click();
        }
    });

    return mealsData; // Return mealsData instead of writing to a file here
}

  module.exports = processItemsAndSave;
