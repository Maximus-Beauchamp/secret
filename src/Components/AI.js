import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Ensure this is correctly loaded
const ENGINE_ID = 'gpt-3.5-turbo-instruct'; // Updated to the latest model ID
const API_URL = `https://api.openai.com/v1/engines/${ENGINE_ID}/completions`;

export const MakeOpenAIRequest = async (prompt) => {
    try {
        const response = await axios.post(API_URL, {
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["\n"]
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].text;
    } catch (error) {
        console.error('AI Recommendation failed:', error.response ? error.response.data : error.message);
        throw error;  // This will help to see the full error object in calling component
    }
};

export default MakeOpenAIRequest;
