import { NextRequest, NextResponse } from 'next/server';

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

    // 检查文件大小 (限制为 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '图片文件不能超过 10MB' },
        { status: 400 }
      );
    }

    // 创建发送给 remove.bg 的 FormData
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'auto');

    // 调用 remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-API-Key': 'xV89izSPiW1XDGRp33vxXtk9',
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', response.status, errorText);

      if (response.status === 402) {
        return NextResponse.json(
          { error: 'API 配额已用完，请稍后再试或联系开发者' },
          { status: 402 }
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          { error: 'API 密钥无效' },
          { status: 403 }
        );
      }

      if (response.status === 400) {
        return NextResponse.json(
          { error: '图片格式不支持或文件损坏' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: '背景移除失败，请稍后再试' },
        { status: 500 }
      );
    }

    // 获取处理后的图片数据
    const imageBuffer = await response.arrayBuffer();

    // 返回处理后的图片
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="no-bg.png"',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('API 处理错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后再试' },
      { status: 500 }
    );
  }
}