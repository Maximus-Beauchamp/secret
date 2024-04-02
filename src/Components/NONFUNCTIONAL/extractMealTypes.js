
async function extractMealTypes(page) {
    // Update MEAL_TYPE_SELECTOR with the actual selector
    await page.waitForSelector('MEAL_TYPE_SELECTOR', { timeout: 5000 });
    return page.evaluate(() => {
        const mealTypes = [];
        document.querySelectorAll('MEAL_TYPE_SELECTOR').forEach(typeElement => {
            const typeName = typeElement.innerText.trim();
            mealTypes.push({ name: typeName, items: [] });
        });
        return mealTypes;
    });
}

module.exports = extractMealTypes;
