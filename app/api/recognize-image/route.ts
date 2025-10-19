import { NextRequest, NextResponse } from 'next/server';

interface VolcanoApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const convertImageToBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
};

const getImageFormat = (file: File): string => {
  const mimeType = file.type;
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpeg';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpeg'; // default fallback
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '请上传图片文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只支持图片文件' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const base64Image = await convertImageToBase64(imageFile);
    const imageFormat = getImageFormat(imageFile);

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
        'Authorization': `Bearer ${process.env.ARK_API_KEY}`,
        'Content-Type': 'application/json'
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

    const data: VolcanoApiResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({
        content: data.choices[0].message.content
      });
    } else {
      return NextResponse.json(
        { error: 'API未返回识别结果' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('图片识别API处理错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后再试' },
      { status: 500 }
    );
  }
}