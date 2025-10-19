"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const [processedDimensions, setProcessedDimensions] = useState<{width: number, height: number} | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setProcessedImage(null);
      setError(null);
      setProcessedDimensions(null);
      setProcessedSize(0);

      // 获取原图尺寸
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setProcessedImage(null);
      setError(null);
      setProcessedDimensions(null);
      setProcessedSize(0);

      // 获取原图尺寸
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '背景移除失败');
      }

      // 获取处理后的图片
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
      setProcessedSize(imageBlob.size);

      // 获取处理后图片的尺寸
      const processedImg = new Image();
      processedImg.onload = () => {
        setProcessedDimensions({ width: processedImg.width, height: processedImg.height });
      };
      processedImg.src = imageUrl;

    } catch (error) {
      console.error('背景移除失败:', error);
      setError(error instanceof Error ? error.message : '背景移除失败，请稍后再试');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `no-bg-${selectedFile?.name || 'image.png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            AI智能识别主体，一键去除图片背景，支持人像、物品、动物等各种场景
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div
              className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
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

          {/* Processing Area */}
          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    文件大小: {formatFileSize(selectedFile.size)}
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
                      onClick={downloadImage}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      下载结果
                    </button>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 mt-0.5">❌</div>
                    <div>
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                        处理失败
                      </h4>
                      <p className="text-red-800 dark:text-red-200 text-sm">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Indicator */}
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
                预览对比
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      原始图片
                    </p>
                    <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                      原图
                    </span>
                  </div>
                  <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg border h-64 flex items-center justify-center overflow-hidden">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="原始图片"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>文件大小:</span>
                      <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
                    </div>
                    {originalDimensions && (
                      <div className="flex justify-between">
                        <span>图片尺寸:</span>
                        <span className="font-medium">{originalDimensions.width} × {originalDimensions.height}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>文件格式:</span>
                      <span className="font-medium">{selectedFile.type.split('/')[1].toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>背景状态:</span>
                      <span className="font-medium">含背景</span>
                    </div>
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      去背景后
                    </p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      processedImage
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {processedImage ? '已完成' : '等待处理'}
                    </span>
                  </div>
                  <div className="relative bg-checkered rounded-lg border h-64 flex items-center justify-center overflow-hidden">
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
                  <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>文件大小:</span>
                      <span className={`font-medium ${processedSize > 0 ? 'text-green-600' : ''}`}>
                        {processedSize > 0 ? formatFileSize(processedSize) : '-'}
                      </span>
                    </div>
                    {processedDimensions ? (
                      <div className="flex justify-between">
                        <span>图片尺寸:</span>
                        <span className="font-medium">{processedDimensions.width} × {processedDimensions.height}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span>图片尺寸:</span>
                        <span>-</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>文件格式:</span>
                      <span className="font-medium">{processedImage ? 'PNG' : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>背景状态:</span>
                      <span className={`font-medium ${processedImage ? 'text-green-600' : ''}`}>
                        {processedImage ? '透明背景' : '-'}
                      </span>
                    </div>
                    {processedSize > 0 && selectedFile.size > 0 && (
                      <div className="flex justify-between">
                        <span>大小变化:</span>
                        <span className={`font-medium ${
                          processedSize < selectedFile.size ? 'text-green-600' :
                          processedSize > selectedFile.size ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {processedSize < selectedFile.size
                            ? `减少 ${((selectedFile.size - processedSize) / selectedFile.size * 100).toFixed(1)}%`
                            : processedSize > selectedFile.size
                            ? `增加 ${((processedSize - selectedFile.size) / selectedFile.size * 100).toFixed(1)}%`
                            : '无变化'
                          }
                        </span>
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