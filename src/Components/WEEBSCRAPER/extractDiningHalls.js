const fs = require('fs');
const processItemsAndSave = require('./dataProcessing'); // Ensure this path is correct

async function extractDiningHalls(page) {
    await page.waitForSelector('.card.unit');
    const halls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.card.unit')).map(hall => {
            const name = hall.querySelector('.cbo_nn_unitNameLink').innerText.trim();
            const status = hall.querySelector('.badge') ? hall.querySelector('.badge').innerText.trim() : 'Unknown';
            const onclick = hall.querySelector('.cbo_nn_unitNameLink').getAttribute('onclick');
            return { name, status, onclick };
        });
    });

    let hallsData = {};

    for (const hall of halls) {
        console.log(`Processing hall: ${hall.name} - Status: ${hall.status}`);
        await page.evaluate(onclick => eval(onclick), hall.onclick);

        // Wait for the #menuPanel to be visible and contain the hall's name.
        // This assumes the hall name appears directly in a selector that can be uniquely identified.
        await page.waitForFunction(
            (hallName) => {
                const menuPanel = document.querySelector('#menuPanel');
                const isVisible = window.getComputedStyle(menuPanel).visibility === 'visible';
                const hallNameMatch = menuPanel.textContent.includes(hallName);
                return isVisible && hallNameMatch;
            },
            {}, // Options object, can set timeout here if needed
            hall.name
        );

        // Continue with scraping the current hall's information
        const processedData = await processItemsAndSave(page, hall.name);
        
        // Adjusting structure to include the hall's name as a key and status within the data
        hallsData[hall.name] = {
            status: hall.status,
            data: processedData
        };

        // Navigate back or reset for the next hall if necessary
    }

    // Write the structured data to a JSON file
    fs.writeFileSync('hallsData.json', JSON.stringify(hallsData, null, 2));
    console.log('Successfully wrote halls data to hallsData.json');

    return hallsData;
}

module.exports = extractDiningHalls;
