"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewSize, setPreviewSize] = useState<number>(0);
  const [isCalculatingPreview, setIsCalculatingPreview] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      setCompressedImage(null);
      setCompressedSize(0);
      setPreviewSize(0);

      // 获取图片尺寸
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  // 实时预览压缩大小
  const updatePreviewSize = async (currentQuality: number, file: File) => {
    setIsCalculatingPreview(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(file);
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setPreviewSize(blob.size);
          }
          setIsCalculatingPreview(false);
        },
        'image/jpeg',
        currentQuality / 100
      );
    } catch (error) {
      console.error('预览计算失败:', error);
      setIsCalculatingPreview(false);
    }
  };

  // 当质量滑块变化时更新预览
  useEffect(() => {
    if (selectedFile) {
      const debounceTimer = setTimeout(() => {
        updatePreviewSize(quality, selectedFile);
      }, 300); // 300ms防抖

      return () => clearTimeout(debounceTimer);
    }
  }, [quality, selectedFile]);

  const compressImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(selectedFile);
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedUrl = URL.createObjectURL(blob);
            setCompressedImage(compressedUrl);
            setCompressedSize(blob.size);
          }
          setIsProcessing(false);
        },
        'image/jpeg',
        quality / 100
      );
    } catch (error) {
      console.error('压缩失败:', error);
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed_${selectedFile?.name || 'image.jpg'}`;
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

  const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            图片压缩
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            智能压缩图片大小，保持最佳画质，支持 JPG、PNG 等格式
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div
              className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                选择图片文件
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                点击或拖拽图片到此区域
              </p>
              <p className="text-sm text-gray-500">
                支持 JPG、PNG、WebP 格式，最大 10MB
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

          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                压缩设置
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  压缩质量: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>高压缩</span>
                  <span>高质量</span>
                </div>
                {isCalculatingPreview && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    正在计算预览大小...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">原始文件</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    大小: {formatFileSize(originalSize)}
                  </p>
                </div>

                {previewSize > 0 && !compressedImage && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">预览压缩后</p>
                    <p className="font-semibold text-blue-600">质量 {quality}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      大小: {formatFileSize(previewSize)}
                    </p>
                    <p className="text-sm text-blue-600">
                      预计节省: {originalSize > 0 ? ((originalSize - previewSize) / originalSize * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                )}

                {compressedSize > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">压缩后</p>
                    <p className="font-semibold text-green-600">压缩完成</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      大小: {formatFileSize(compressedSize)}
                    </p>
                    <p className="text-sm text-green-600">
                      节省: {compressionRatio}%
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={compressImage}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isProcessing ? '压缩中...' : '开始压缩'}
                </button>

                {compressedImage && (
                  <button
                    onClick={downloadCompressed}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    下载压缩图片
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                预览对比
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      原始图片
                    </p>
                    <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                      原图
                    </span>
                  </div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="原始图片"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>文件大小:</span>
                      <span className="font-medium">{formatFileSize(originalSize)}</span>
                    </div>
                    {imageDimensions && (
                      <div className="flex justify-between">
                        <span>图片尺寸:</span>
                        <span className="font-medium">{imageDimensions.width} × {imageDimensions.height}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>文件格式:</span>
                      <span className="font-medium">{selectedFile.type.split('/')[1].toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>质量:</span>
                      <span className="font-medium">原始质量</span>
                    </div>
                  </div>
                </div>

                {compressedImage ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        压缩后图片
                      </p>
                      <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs">
                        已压缩
                      </span>
                    </div>
                    <img
                      src={compressedImage}
                      alt="压缩后图片"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>文件大小:</span>
                        <span className="font-medium text-green-600">{formatFileSize(compressedSize)}</span>
                      </div>
                      {imageDimensions && (
                        <div className="flex justify-between">
                          <span>图片尺寸:</span>
                          <span className="font-medium">{imageDimensions.width} × {imageDimensions.height}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>文件格式:</span>
                        <span className="font-medium">JPEG</span>
                      </div>
                      <div className="flex justify-between">
                        <span>压缩质量:</span>
                        <span className="font-medium">{quality}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>压缩比例:</span>
                        <span className="font-medium text-green-600">节省 {compressionRatio}%</span>
                      </div>
                    </div>
                  </div>
                ) : previewSize > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        预览压缩效果
                      </p>
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        预览
                      </span>
                    </div>
                    <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="text-4xl mb-2">🔍</div>
                        <p className="text-sm">压缩预览</p>
                        <p className="text-xs">点击"开始压缩"查看效果</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>预计大小:</span>
                        <span className="font-medium text-blue-600">{formatFileSize(previewSize)}</span>
                      </div>
                      {imageDimensions && (
                        <div className="flex justify-between">
                          <span>图片尺寸:</span>
                          <span className="font-medium">{imageDimensions.width} × {imageDimensions.height}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>目标格式:</span>
                        <span className="font-medium">JPEG</span>
                      </div>
                      <div className="flex justify-between">
                        <span>压缩质量:</span>
                        <span className="font-medium">{quality}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>预计节省:</span>
                        <span className="font-medium text-blue-600">
                          {originalSize > 0 ? ((originalSize - previewSize) / originalSize * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        压缩后图片
                      </p>
                      <span className="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded text-xs">
                        等待中
                      </span>
                    </div>
                    <div className="w-full h-64 bg-gray-50 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">⏳</div>
                        <p className="text-sm">压缩后的图片将显示在这里</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>文件大小:</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>图片尺寸:</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>文件格式:</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>压缩质量:</span>
                        <span>-</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}