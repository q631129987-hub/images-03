// AI Image Generation API for Volcano Engine
export interface ImageGenerationRequest {
  prompt: string;
  size?: '1K' | '2K' | '4K';
  sequential_image_generation?: 'enabled' | 'disabled';
  response_format?: 'url' | 'b64_json';
  stream?: boolean;
  watermark?: boolean;
}

export interface ImageGenerationResponse {
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
  created: number;
}

export const generateImageWithVolcano = async (request: ImageGenerationRequest): Promise<ImageGenerationResponse> => {
  try {
    const payload = {
      model: "ep-20251019174112-h5hsx",
      prompt: request.prompt,
      sequential_image_generation: request.sequential_image_generation || "disabled",
      response_format: request.response_format || "url",
      size: request.size || "2K",
      stream: request.stream || false,
      watermark: request.watermark !== false // 默认为true
    };

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ARK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status: ${response.status}, message: ${errorText}`);
    }

    const data: ImageGenerationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Volcano Image Generation API error:', error);
    throw error;
  }
};