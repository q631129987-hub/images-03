// Volcano Engine API integration
import { convertImageToBase64, getImageFormat } from './imageUtils';

export interface VolcanoApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const recognizeImageWithVolcano = async (file: File): Promise<string> => {
  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(file);
    const imageFormat = getImageFormat(file);

    // Prepare the request payload
    const payload = {
      model: "ep-20251019164857-h8lnj",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "识别图片"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${imageFormat};base64,${base64Image}`
              }
            }
          ]
        }
      ]
    };

    // Make API request to Volcano Engine
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ARK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data: VolcanoApiResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error('No recognition result returned from API');
    }
  } catch (error) {
    console.error('Volcano API error:', error);
    throw error;
  }
};