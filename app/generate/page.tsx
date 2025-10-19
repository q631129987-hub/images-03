"use client";

import Link from "next/link";
import { useState } from "react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: number;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("realistic");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const styles = [
    { id: "realistic", name: "真实风格", description: "逼真的照片效果" },
    { id: "artistic", name: "艺术风格", description: "绘画艺术效果" },
    { id: "anime", name: "动漫风格", description: "日式动漫风格" },
    { id: "cartoon", name: "卡通风格", description: "可爱卡通效果" },
    { id: "sketch", name: "素描风格", description: "铅笔素描效果" },
    { id: "oil", name: "油画风格", description: "经典油画效果" }
  ];

  const promptTemplates = [
    "一只可爱的小猫在花园里玩耍",
    "未来科技城市的夜景",
    "美丽的山水风景画",
    "宇宙中的神秘星球",
    "古典欧式建筑",
    "梦幻森林中的小屋"
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 这里是模拟的生成结果
      // 在实际应用中，你需要集成真正的AI生图API，比如：
      // - OpenAI DALL-E API
      // - Stability AI
      // - Midjourney API
      // - 本地Stable Diffusion模型

      // 生成一个模拟的图片URL（这里使用placeholder图片）
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: `https://picsum.photos/512/512?random=${Date.now()}`,
        prompt: prompt,
        style: selectedStyle,
        timestamp: Date.now()
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setIsGenerating(false);
    } catch (error) {
      console.error('生成失败:', error);
      setIsGenerating(false);
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
    return styles.find(s => s.id === styleId)?.name || styleId;
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

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                艺术风格
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedStyle === style.id
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {style.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {style.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 mt-0.5">ℹ️</div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  功能说明
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  这是一个演示版本，显示的是随机图片。在实际应用中，需要集成专业的AI生图API（如OpenAI DALL-E、Stability AI等）来实现真正的AI图片生成功能。
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
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{getStyleName(image.style)}</span>
                        <span>{new Date(image.timestamp).toLocaleTimeString()}</span>
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