const puppeteer = require('puppeteer');
const readline = require('readline');
const extractDiningHalls = require('./extractDiningHalls'); // Correct path as needed
const processItemsAndSave = require('./dataProcessing')

async function main() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://netnutrition.cbord.com/nn-prod/vucampusdining#new_tab');

    const answer = await new Promise(resolve => rl.question("Are you on the correct item page? (y/n): ", resolve));
    if (answer.toLowerCase() === 'y') {
        await processItemsAndSave(page);
    } else {
        console.log("Please navigate to the correct page and try again.");
    }

   // await browser.close();
    rl.close();
}

main().catch(console.error);
