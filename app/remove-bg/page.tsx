"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setProcessedImage(null);
    }
  };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      // 这里是一个简化的背景移除示例
      // 在实际应用中，你需要集成真正的背景移除API，比如：
      // - Remove.bg API
      // - 本地AI模型
      // - 其他背景移除服务

      // 模拟处理过程
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 这里只是示例，实际应该调用真正的背景移除API
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(selectedFile);
      });

      canvas.width = img.width;
      canvas.height = img.height;

      // 创建渐变遮罩效果作为示例
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // 创建一个简单的遮罩效果（这不是真正的背景移除）
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 简单的边缘检测和透明度调整
          const brightness = (r + g + b) / 3;
          if (brightness > 200) {
            data[i + 3] = 100; // 降低亮色区域透明度
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImage(processedUrl);
        }
        setIsProcessing(false);
      }, 'image/png');

    } catch (error) {
      console.error('处理失败:', error);
      setIsProcessing(false);
    }
  };

  const downloadProcessed = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `removed_bg_${selectedFile?.name || 'image.png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-800 mb-4"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            抠图去背景
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI智能识别主体，一键去除图片背景，支持人像、物品等各种场景
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div
              className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-6xl mb-4">✂️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                选择要抠图的图片
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                点击或拖拽图片到此区域
              </p>
              <p className="text-sm text-gray-500">
                支持 JPG、PNG 格式，最大 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Processing Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 mt-0.5">ℹ️</div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  功能说明
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  这是一个演示版本。在实际应用中，需要集成专业的背景移除API（如Remove.bg）或部署本地AI模型来实现高质量的背景移除效果。
                </p>
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    准备进行背景移除
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={removeBackground}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? '处理中...' : '开始抠图'}
                  </button>

                  {processedImage && (
                    <button
                      onClick={downloadProcessed}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      下载结果
                    </button>
                  )}
                </div>
              </div>

              {isProcessing && (
                <div className="mb-6">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-600 h-full animate-pulse w-3/4"></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    AI正在识别并移除背景...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                处理结果
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    原始图片
                  </p>
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="原始图片"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    去背景后
                  </p>
                  <div className="relative bg-checkered bg-white rounded-lg border h-64 flex items-center justify-center">
                    {processedImage ? (
                      <img
                        src={processedImage}
                        alt="去背景后图片"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm">处理后的图片将显示在这里</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {processedImage && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-green-600">✅</div>
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      背景移除完成！图片已转换为PNG格式，支持透明背景。
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">💡 使用技巧</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• 主体清晰、背景简单的图片效果更好</li>
              <li>• 建议使用高分辨率图片获得更好的抠图效果</li>
              <li>• 人像照片建议主体与背景对比明显</li>
              <li>• 处理后的图片为PNG格式，支持透明背景</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-checkered {
          background-image:
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        }
      `}</style>
    </div>
  );
}