const scrapeNutritionData = require('./scrapeNutritionData');

async function openNutritionLabelAndScrapeInfo(page) {
  await page.waitForSelector('.cbo_nn_itemHover');

  let nutritionalData = {}; // Object to hold the structured nutritional info

  const itemsWithMealType = await page.evaluate(() => {
    const items = [];
    let currentMealType = '';
    document.querySelectorAll('tr').forEach(row => {
      if (row.classList.contains('cbo_nn_itemGroupRow')) {
        currentMealType = row.querySelector('div[role="button"]').textContent.trim();
      } else if (row.querySelector('.cbo_nn_itemHover')) {
        const itemName = row.querySelector('.cbo_nn_itemHover').textContent.trim();
        items.push({ mealType: currentMealType, itemName, index: Array.from(document.querySelectorAll('.cbo_nn_itemHover')).indexOf(row.querySelector('.cbo_nn_itemHover')) });
      }
    });
    return items;
  });

  for (let item of itemsWithMealType) {
    await page.evaluate((index) => {
      document.querySelectorAll('.cbo_nn_itemHover')[index].click();
    }, item.index);

    await page.waitForSelector('.cbo_nn_LabelHeader', { visible: true });

    const nutritionalInfo = await scrapeNutritionData(page);

    // Organize the data into the new structure
    if (!nutritionalData[item.mealType]) {
      nutritionalData[item.mealType] = {};
    }
    nutritionalData[item.mealType][item.itemName] = {
      macros: {
        protein: nutritionalInfo.macros.protein,
        fat: nutritionalInfo.macros.fat,
        carbs: nutritionalInfo.macros.carbs,
        totalCalories: nutritionalInfo.macros.totalCalories
      }
    };
  }
  // After loop finishes, click back to continue navigating to all different meal of days
  await page.click("a[onclick='NetNutrition.UI.menuDetailBackBtn()']");
  return nutritionalData;
}

module.exports = openNutritionLabelAndScrapeInfo;
