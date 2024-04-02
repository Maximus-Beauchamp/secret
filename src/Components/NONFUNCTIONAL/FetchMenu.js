const axios = require('axios');
const cheerio = require('cheerio');
const cookie = "ASP.NET_SessionId=ifn5enub5oo2rgqqwqh2atpe; AWSALB=daQizjb6PDeHDOODUWq0hgsC8e5y/EiBTaA8vABPL0VE7SAPpBCz2jYIkGbeH95Vi1iKdKesMfrrFc3ydjDVEcduIazQVlqH8WBMqPpyQlcYfOq4BII3W1cyy8oO; AWSALBCORS=daQizjb6PDeHDOODUWq0hgsC8e5y/EiBTaA8vABPL0VE7SAPpBCz2jYIkGbeH95Vi1iKdKesMfrrFc3ydjDVEcduIazQVlqH8WBMqPpyQlcYfOq4BII3W1cyy8oO; CBORD.netnutrition2=NNexternalID=vucampusdining;"
const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Referer": "https://netnutrition.cbord.com/nn-prod/vucampusdining",
    "X-Requested-With": "XMLHttpRequest",
    "Cookie": cookie
};

// Data payload
const data = new URLSearchParams({
    "menuOid": "7421353" // Ensure this is the correct parameter and value for your request
});

// Perform the POST request
axios.post('https://netnutrition.cbord.com/nn-prod/vucampusdining/Menu/SelectMenu', data.toString(), { headers })
    .then(response => {
        const $ = cheerio.load(response.data.panels.find(panel => panel.id === 'itemPanel').html);
        
        let menu = {};

        $('tr').each((index, element) => {
            // Check if the row is a category header
            if ($(element).find('td[role="gridcell"][colspan="5"]').length) {
                // Extract the category name (e.g., Breakfast)
                const categoryName = $(element).find('div[role="button"]').text().trim();
                // Initialize the category in the menu object if not already present
                if (!menu[categoryName]) {
                    menu[categoryName] = [];
                }
            } else if ($(element).hasClass('cbo_nn_itemPrimaryRow')) {
                // If the row is not a category header, it's assumed to be a menu item belonging to the last found category
                const lastCategoryName = Object.keys(menu).pop();
                if (lastCategoryName) {
                    // Find the element with the onclick attribute that contains the item ID
                    const onclickAttribute = $(element).find('[onclick*="getItemNutritionLabelOnClick"]').attr('onclick');
                    // Use a regular expression to extract the ID from the onclick attribute
                    const itemIdMatch = onclickAttribute ? /getItemNutritionLabelOnClick\(event,(\d+)\)/.exec(onclickAttribute) : null;
                    const itemId = itemIdMatch ? itemIdMatch[1] : null;
        
                    // Extract the menu item name
                    const itemName = $(element).find('.cbo_nn_itemHover').text().trim();
        
                    if (itemId) {
                        // Add this item along with its ID to the corresponding category
                        menu[lastCategoryName].push({ name: itemName, id: itemId });
                    } else {
                        // If no ID found, just add the item name
                        menu[lastCategoryName].push({ name: itemName });
                    }
                }
            }
        });
        

        // Output the structured menu object
        console.log(JSON.stringify(menu, null, 2));
    })
    .catch(error => {
        console.error('There was an error!', error.message);
    });

    module.exports = cookie;