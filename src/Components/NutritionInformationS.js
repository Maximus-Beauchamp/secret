const axios = require('axios');
const cheerio = require('cheerio');

// Sample function to fetch a page and log its title (for debugging)
async function fetchPageTitle(url) {
    console.log(`Fetching page: ${url}`);
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const pageTitle = $('title').text();
        console.log(`Page title: ${pageTitle}`);
    } catch (error) {
        console.error(`Error fetching page: ${error.message}`);
    }
}

// Main function to orchestrate your script
async function main() {
    console.log('Script is starting...');
    
    // Example URL - replace with your target URL
    const url = "";
    
    await fetchPageTitle(url);

    console.log('Script has finished.');
}

// Run the main function and catch any top-level errors
main().catch(error => console.error(`Main function error: ${error.message}`));
