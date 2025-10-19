import { NextRequest, NextResponse } from 'next/server';

interface ImageGenerationRequest {
  prompt: string;
  size?: string; // 支持自定义尺寸格式，如 "1024x768"
  sequential_image_generation?: 'enabled' | 'disabled';
  response_format?: 'url' | 'b64_json';
  stream?: boolean;
  watermark?: boolean;
}

interface ImageGenerationResponse {
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
  created: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();

    const payload = {
      model: "ep-20251019174112-h5hsx",
      prompt: body.prompt,
      sequential_image_generation: body.sequential_image_generation || "disabled",
      response_format: body.response_format || "url",
      size: body.size || "1024x1024", // 默认为正方形
      stream: body.stream || false,
      watermark: body.watermark !== false // 默认为true
    };

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ARK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Volcano API error:', response.status, errorText);
      return NextResponse.json(
        { error: `API请求失败: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data: ImageGenerationResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('生图API处理错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后再试' },
      { status: 500 }
    );
  }
}