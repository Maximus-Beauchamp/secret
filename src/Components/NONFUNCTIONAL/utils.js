async function clickOnDiningHall(page, hallName) {
    // Click on the dining hall by matching its name. This assumes the name is unique and clickable.
    await page.evaluate((name) => {
        const link = Array.from(document.querySelectorAll('.cbo_nn_unitNameLink'))
                          .find(el => el.innerText.trim() === name);
        if (link) {
            link.click();
        }
    }, hallName);

    // Adjust the selector below to an element that signifies that the dining hall details have loaded.
    await page.waitForSelector('.details-loaded-indicator', { timeout: 5000 });
}
// utils.js
async function clickOnMealOfDay(page, mealId) {
    // Directly execute the JavaScript function from the onclick attribute
    await page.evaluate((id) => {
        const scriptToExecute = `NetNutrition.UI.menuListSelectMenu(${id});`;
        eval(scriptToExecute);
    }, mealId);

    // Wait for an indicator that the meal details have loaded. This might be a specific
    // container, a loading spinner disappearing, or any content change that reliably indicates loading completion.
    await page.waitForSelector('.details-loaded-indicator', { timeout: 10000 });
}

module.exports = {
    clickOnMealOfDay,
    clickOnDiningHall,
};
