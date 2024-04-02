const axios = require('axios').default;
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// Creating an Axios instance with cookie jar support
const cookieJar = new CookieJar();
const client = wrapper(axios.create({ jar: cookieJar }));
client.defaults.withCredentials = true;

// Function to initialize session and capture cookies
async function initializeSessionAndGetCookies() {
    try {
        // Initial visit to set cookies
        await client.get('https://netnutrition.cbord.com/nn-prod/vucampusdining#new_tab');
        console.log('Session initialized, cookies captured.');
    } catch (error) {
        console.error('Failed to initialize session:', error);
    }
}

// Adjusted function to fetch and capture cookies, now including session initialization
async function fetchAndCaptureCookiesWithLimitedRedirect(url, postData, headers) {
    await initializeSessionAndGetCookies(); // Ensure session is initialized

    client.post(url, postData, { headers, maxRedirects: 0 }) // Disable automatic redirection
        .then(async response => {
            console.log('Response received without redirection.');

            // Retrieve and format cookies after the POST request
            const rawCookies = await cookieJar.getCookies('https://netnutrition.cbord.com');
            const formattedCookies = rawCookies.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');
            console.log('Formatted Cookies String after POST request:', formattedCookies);

            // You can now use `formattedCookies` for subsequent requests or other purposes
        })
        .catch(async error => {
            // Similar cookie processing can be done here in case of redirection or error
            console.error('Error or redirection encountered:', error.message);
        });
}

// The URL and POST data for your specific request
const url = 'https://netnutrition.cbord.com/nn-prod/vucampusdining/Menu/SelectMenu';
const postData = new URLSearchParams({ "menuOid": "7421350" }).toString();
const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
    "Referer": "https://netnutrition.cbord.com/nn-prod/vucampusdining#new_tab",
};

// Execute the function
(async () => {
    await fetchAndCaptureCookiesWithLimitedRedirect(url, postData, headers);
})();
