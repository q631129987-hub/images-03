"use client";

import Link from "next/link";
import { useState } from "react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: number;
  size: string;
  revisedPrompt?: string;
}

interface ImageGenerationRequest {
  prompt: string;
  size?: string; // 改为支持自定义尺寸格式，如 "1024x768"
  sequential_image_generation?: 'enabled' | 'disabled';
  response_format?: 'url' | 'b64_json';
  stream?: boolean;
  watermark?: boolean;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedResolution, setSelectedResolution] = useState<'1K' | '2K' | '4K'>('2K');
  const [selectedRatio, setSelectedRatio] = useState<string>('1:1');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const styleTemplates = [
    { id: "realistic", name: "真实风格", modifier: ", photorealistic, high quality, detailed", description: "逼真的照片效果" },
    { id: "artistic", name: "艺术风格", modifier: ", artistic painting, masterpiece, fine art", description: "绘画艺术效果" },
    { id: "anime", name: "动漫风格", modifier: ", anime style, manga art, japanese animation", description: "日式动漫风格" },
    { id: "cartoon", name: "卡通风格", modifier: ", cartoon style, cute, colorful", description: "可爱卡通效果" },
    { id: "sketch", name: "素描风格", modifier: ", pencil sketch, black and white, artistic drawing", description: "铅笔素描效果" },
    { id: "oil", name: "油画风格", modifier: ", oil painting, classical art, brush strokes", description: "经典油画效果" }
  ];

  const resolutions = [
    { id: '1K' as const, name: '1K', description: '1024像素', detail: '标准质量' },
    { id: '2K' as const, name: '2K', description: '2048像素', detail: '高清质量' },
    { id: '4K' as const, name: '4K', description: '4096像素', detail: '超高清' }
  ];

  const aspectRatios = [
    { id: '21:9', name: '21:9', description: '超宽屏', detail: '电影比例' },
    { id: '16:9', name: '16:9', description: '宽屏', detail: '视频标准' },
    { id: '3:2', name: '3:2', description: '相机比例', detail: '经典摄影' },
    { id: '4:3', name: '4:3', description: '传统比例', detail: '标准画面' },
    { id: '1:1', name: '1:1', description: '正方形', detail: '社交媒体' },
    { id: '3:4', name: '3:4', description: '竖版相机', detail: '人像摄影' },
    { id: '2:3', name: '2:3', description: '竖版标准', detail: '海报比例' },
    { id: '9:16', name: '9:16', description: '竖屏视频', detail: '短视频' }
  ];

  const promptTemplates = [
    "星际穿越，黑洞，黑洞里冲出一辆复古列车，抢视觉冲击力，电影大片",
    "未来科技城市的夜景，霓虹灯，赛博朋克风格，高分辨率",
    "美丽的山水风景画，中国水墨画风格，意境深远",
    "宇宙中的神秘星球，梦幻色彩，星云背景",
    "古典欧式建筑，巴洛克风格，金色装饰，华丽庄严",
    "梦幻森林中的小屋，魔法光芒，童话风格，温馨"
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      // 构建样式化的提示词
      const stylePrompt = getStyledPrompt(prompt, selectedStyle);

      // 计算实际图片尺寸
      const actualSize = calculateImageSize(selectedResolution, selectedRatio);

      // 准备请求参数
      const request: ImageGenerationRequest = {
        prompt: stylePrompt,
        size: actualSize, // 使用计算出的实际尺寸
        sequential_image_generation: "disabled",
        response_format: "url",
        stream: false,
        watermark: true
      };

      // 调用本地API路由
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        let errorMessage = '生成失败';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('API响应格式错误');
      }

      if (data.data && data.data.length > 0) {
        const imageData = data.data[0];
        if (imageData.url) {
          const newImage: GeneratedImage = {
            id: Date.now().toString(),
            url: imageData.url,
            prompt: prompt,
            style: selectedStyle,
            size: `${selectedResolution} (${selectedRatio}) - ${actualSize}`,
            timestamp: Date.now(),
            revisedPrompt: imageData.revised_prompt
          };

          setGeneratedImages(prev => [newImage, ...prev]);
        } else {
          throw new Error('API未返回图片URL');
        }
      } else {
        throw new Error('API未返回图片数据');
      }

      setIsGenerating(false);
    } catch (error) {
      console.error('生成失败:', error);
      setError(error instanceof Error ? error.message : '生成失败，请重试');
      setIsGenerating(false);
    }
  };

  const calculateImageSize = (resolution: '1K' | '2K' | '4K', ratio: string): string => {
    // 基础尺寸定义
    const baseSizes = {
      '1K': 1024,
      '2K': 2048,
      '4K': 4096
    };

    const baseSize = baseSizes[resolution];

    // 解析比例
    const [widthRatio, heightRatio] = ratio.split(':').map(Number);

    // 根据比例计算宽高
    let width: number, height: number;

    if (widthRatio >= heightRatio) {
      // 横向或正方形
      width = baseSize;
      height = Math.round(baseSize * (heightRatio / widthRatio));
    } else {
      // 纵向
      height = baseSize;
      width = Math.round(baseSize * (widthRatio / heightRatio));
    }

    // 确保尺寸是8的倍数（常见的图像生成要求）
    width = Math.round(width / 8) * 8;
    height = Math.round(height / 8) * 8;

    return `${width}x${height}`;
  };

  const getStyledPrompt = (basePrompt: string, styleId: string): string => {
    if (!styleId) return basePrompt;

    const selectedTemplate = styleTemplates.find(template => template.id === styleId);
    if (selectedTemplate) {
      return basePrompt + selectedTemplate.modifier;
    }

    return basePrompt;
  };

  const applyStyleTemplate = (templateId: string) => {
    const template = styleTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedStyle(templateId);
    }
  };

  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai_generated_${prompt.slice(0, 20)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStyleName = (styleId: string) => {
    return styleTemplates.find(s => s.id === styleId)?.name || styleId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-pink-600 hover:text-pink-800 mb-4"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            AI生图
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            输入描述词，让AI为您创作独特的艺术作品
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Generation Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              创作设置
            </h3>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                描述词 (Prompt)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请描述您想要生成的图片内容..."
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                提示：详细的描述能够生成更准确的图片
              </p>
            </div>

            {/* Quick Templates */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                快速模板
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {promptTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(template)}
                    className="text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Templates */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                风格模板建议 <span className="text-gray-500 text-xs">(可选)</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                点击下方模板快速应用风格，或自由创作不受限制
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styleTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyStyleTemplate(template.id)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      selectedStyle === template.id
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
              {selectedStyle && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-green-600 dark:text-green-400">
                    ✓ 已应用{styleTemplates.find(t => t.id === selectedStyle)?.name}风格
                  </span>
                  <button
                    onClick={() => setSelectedStyle("")}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    清除风格
                  </button>
                </div>
              )}
            </div>

            {/* Resolution Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                图片分辨率
              </label>
              <div className="grid grid-cols-3 gap-3">
                {resolutions.map((resolution) => (
                  <button
                    key={resolution.id}
                    onClick={() => setSelectedResolution(resolution.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedResolution === resolution.id
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {resolution.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {resolution.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {resolution.detail}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                图片比例
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      selectedRatio === ratio.id
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {ratio.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {ratio.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ratio.detail}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Preview */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 dark:text-blue-400">📐</span>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  生成预览
                </h4>
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p>
                  <span className="font-medium">分辨率:</span> {selectedResolution} ({
                    selectedResolution === '1K' ? '1024像素' :
                    selectedResolution === '2K' ? '2048像素' : '4096像素'
                  })
                </p>
                <p>
                  <span className="font-medium">比例:</span> {selectedRatio} ({
                    aspectRatios.find(r => r.id === selectedRatio)?.description
                  })
                </p>
                <p>
                  <span className="font-medium">实际尺寸:</span> {calculateImageSize(selectedResolution, selectedRatio)}
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 mt-0.5">⚠️</div>
                  <div>
                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      生成失败
                    </h4>
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateImage}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              {isGenerating ? '生成中...' : '生成图片'}
            </button>

            {isGenerating && (
              <div className="mt-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-pink-600 h-full animate-pulse w-3/4"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                  AI正在创作中，请稍候...
                </p>
              </div>
            )}
          </div>

          {/* API Notice */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-green-500 mt-0.5">🚀</div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  API集成完成
                </h4>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  已集成火山引擎AI生图API，提供真实的AI图片生成功能。支持多种尺寸、风格和高质量图片生成。
                </p>
              </div>
            </div>
          </div>

          {/* Generated Images Gallery */}
          {generatedImages.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                生成历史
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((image) => (
                  <div
                    key={image.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                        <strong>原始提示词：</strong>{image.prompt}
                      </p>
                      {image.revisedPrompt && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          <strong>AI优化提示词：</strong>{image.revisedPrompt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{getStyleName(image.style)}</span>
                        <span>{image.size}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3 text-center">
                        {new Date(image.timestamp).toLocaleString()}
                      </div>
                      <button
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded text-sm transition-colors"
                      >
                        下载图片
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">💡 创作技巧</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• 使用详细、具体的描述词获得更好的生成效果</li>
              <li>• 可以指定颜色、光线、构图等细节要求</li>
              <li>• 不同的艺术风格适用于不同类型的创作需求</li>
              <li>• 可以参考优秀的提示词模板来优化您的描述</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}