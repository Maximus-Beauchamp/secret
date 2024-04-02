const puppeteer = require('puppeteer');
const readline = require('readline');
const extractDiningHalls = require('./extractDiningHalls'); // Correct path as needed

async function main() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://netnutrition.cbord.com/nn-prod/vucampusdining#new_tab');

    const answer = await new Promise(resolve => rl.question("Run webscraper? (y/n): ", resolve));
    if (answer.toLowerCase() === 'y') {
        await extractDiningHalls(page);
    } else {
        console.log("Aborting webscraper.");
    }

    await browser.close();
    rl.close();
}

main().catch(console.error);
