const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = 'https://netnutrition.cbord.com/nn-prod/vucampusdining#new_tab';
    await page.goto(url);

    await page.waitForSelector('.card.unit');

    const hallData = await page.evaluate(() => {
        const halls = [];
        document.querySelectorAll('.card.unit').forEach(hallElement => {
            const hallName = hallElement.querySelector('.cbo_nn_unitNameLink').innerText;
            const statusElement = hallElement.querySelector('.badge.badge-danger');
            const status = statusElement ? statusElement.innerText.trim() : 'Open';
            halls.push({ name: hallName, status: status, mealsOfTheDay: [] });
        });
        return halls;
    });

    for (let i = 0; i < hallData.length; i++) {
        await page.evaluate((index) => {
            document.querySelectorAll('.cbo_nn_unitNameLink')[index].click();
        }, i);

        try {
            await page.waitForSelector('.cbo_nn_menuLinkCell', { timeout: 5000 });

            const mealsData = await page.evaluate(() => {
                const meals = [];
                document.querySelectorAll('.cbo_nn_menuLinkCell').forEach(mealElement => {
                    const mealType = mealElement.querySelector('.cbo_nn_menuLink').innerText.trim();
                    meals.push({ type: mealType, items: [] });
                });
                return meals;
            });

            for (let j = 0; j < mealsData.length; j++) {
                await page.evaluate((mealIndex) => {
                    document.querySelectorAll('.cbo_nn_menuLink')[mealIndex].click();
                }, j);

                await page.waitForSelector('ITEM_SELECTOR', { timeout: 5000 }); // Replace ITEM_SELECTOR with the actual selector for items

                // This is a placeholder for extracting item names and nutritional information
                // Adjust it based on the actual structure of the items page
                const itemsData = await page.evaluate(() => {
                    const items = [];
                    document.querySelectorAll('ITEM_NAME_SELECTOR').forEach(item => { // Replace ITEM_NAME_SELECTOR
                        // Assuming a dummy structure for demonstration
                        const itemName = item.innerText.trim();
                        const protein = "Xg"; // Replace these with actual selectors and logic
                        const carbs = "Yg";
                        const fat = "Zg";
                        const total_calories = "W kcal";
                        items.push({
                            name: itemName,
                            calories_and_macros: {
                                protein,
                                carbs,
                                fat,
                                total_calories
                            }
                        });
                    });
                    return items;
                });

                mealsData[j].items = itemsData;
                await page.goBack();
            }

            hallData[i].mealsOfTheDay = mealsData;
            await page.goto(url); // Go back to the main page to process the next hall
            await page.waitForSelector('.card.unit');
        } catch (error) {
            console.error(`Error processing Hall ${i + 1}: ${error.message}`);
        }
    }

    console.log(JSON.stringify(hallData, null, 2));
    // await browser.close();
})();
