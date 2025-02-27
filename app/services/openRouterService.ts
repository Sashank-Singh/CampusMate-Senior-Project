// services/openRouterService.ts
import axios from 'axios';
export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
import dotenv from 'dotenv';
dotenv.config();

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined in the environment variables.');
}

export const processImageWithVisionLLM = async (base64Image: string, prompt: string) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'Referer': 'https://campusmateapp.com' // Corrected header key
        }
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No choices returned from OpenRouter API.');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
  
};