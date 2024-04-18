async function scrapeNutritionalInformation(page) {
    const nutritionalInfo = await page.evaluate(() => {
        const info = {
            mealItemName: '',
            macros: {
                totalCalories: '0 calories',
                fat: '0g',
                protein: '0g',
                carbs: '0g'
            }
        };

        // Extracting the meal item name
        const nameElement = document.querySelector('.cbo_nn_LabelHeader');
        if (nameElement) {
            info['mealItemName'] = nameElement.innerText.trim();
        }

        // Extracting Total Calories
        const caloriesElement = document.querySelector('td.cbo_nn_LabelDetail span.cbo_nn_SecondaryNutrient');
        if (caloriesElement) {
            info['macros']['totalCalories'] = caloriesElement.innerText.trim() + ' calories';
        }

        // Extracting nutritional facts
        document.querySelectorAll('tr').forEach((row) => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 1) { // Ensure the row has multiple cells, indicative of a nutrient row
                const nutrientName = cells[0].innerText.trim();
                const nutrientValue = cells[1].innerText.trim();

                // Matching nutrient names and adding them to the macros object
                if (nutrientName.startsWith('Total Fat')) {
                    info['macros']['fat'] = nutrientValue;
                } else if (nutrientName.startsWith('Protein')) {
                    info['macros']['protein'] = nutrientValue;
                } else if (nutrientName.startsWith('Total Carbohydrate')) {
                    info['macros']['carbs'] = nutrientValue;
                }
            }
        });

        return info;
    });

    // After scraping the information, click the close button to close the nutritional information popup
    const closeButtonSelector = '#btn_nn_nutrition_close';
    await page.waitForSelector(closeButtonSelector, {visible: true});
    await page.click(closeButtonSelector);

    // Optional: Wait for the popup to be fully closed, if necessary, by waiting for the selector to be removed from the DOM, or any other indication that the popup has closed.

    return nutritionalInfo;
}

module.exports = scrapeNutritionalInformation;
