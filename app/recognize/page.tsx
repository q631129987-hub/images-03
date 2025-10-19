"use client";

import Link from "next/link";
import { useState, useRef } from "react";

interface RecognitionResult {
  category: string;
  confidence: number;
  description: string;
  tags: string[];
  text?: string;
}

export default function RecognizePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'object' | 'text'>('object');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setRecognitionResult(null);
    }
  };

  const recognizeImage = async (type: 'object' | 'text') => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setActiveTab(type);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 这里是模拟的识别结果
      // 在实际应用中，你需要集成真正的图像识别API，比如：
      // - Google Cloud Vision API
      // - Azure Computer Vision
      // - AWS Rekognition
      // - Tesseract.js (用于OCR)

      if (type === 'object') {
        // 模拟物体识别结果
        const mockObjectResult: RecognitionResult = {
          category: "风景",
          confidence: 87.5,
          description: "这是一张自然风景照片，包含山脉、天空等元素。画面构图优美，色彩丰富。",
          tags: ["自然", "风景", "山脉", "天空", "户外", "摄影"]
        };
        setRecognitionResult(mockObjectResult);
      } else {
        // 模拟文字识别结果
        const mockTextResult: RecognitionResult = {
          category: "文档",
          confidence: 92.3,
          description: "检测到图片中包含文字内容",
          tags: ["文档", "文字", "OCR"],
          text: "这里是模拟的OCR识别结果文本。在实际应用中，会显示从图片中提取的真实文字内容。支持中文、英文等多种语言识别。"
        };
        setRecognitionResult(mockTextResult);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('识别失败:', error);
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    if (recognitionResult?.text) {
      navigator.clipboard.writeText(recognitionResult.text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            图片识别
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI智能识别图片内容，支持物体识别和文字提取（OCR）
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div
              className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                选择要识别的图片
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

          {/* Function Tabs */}
          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                选择识别类型
              </h3>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => recognizeImage('object')}
                  disabled={isProcessing}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>🏷️</span>
                  {isProcessing && activeTab === 'object' ? '识别中...' : '物体识别'}
                </button>

                <button
                  onClick={() => recognizeImage('text')}
                  disabled={isProcessing}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>📝</span>
                  {isProcessing && activeTab === 'text' ? '识别中...' : '文字识别(OCR)'}
                </button>
              </div>

              {isProcessing && (
                <div className="mb-6">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-600 h-full animate-pulse w-2/3"></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    AI正在分析图片内容...
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2"><strong>物体识别：</strong>识别图片中的物体、场景、动物等内容</p>
                <p><strong>文字识别：</strong>提取图片中的文字内容，支持多种语言</p>
              </div>
            </div>
          )}

          {/* Results */}
          {selectedFile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  图片预览
                </h3>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="上传的图片"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>文件名：</strong>{selectedFile.name}</p>
                  <p><strong>大小：</strong>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {/* Recognition Results */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  识别结果
                </h3>

                {recognitionResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        类别
                      </span>
                      <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                        {recognitionResult.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        可信度
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${recognitionResult.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {recognitionResult.confidence}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                        描述
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {recognitionResult.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                        标签
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {recognitionResult.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {recognitionResult.text && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            提取的文字
                          </span>
                          <button
                            onClick={copyText}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            复制文字
                          </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {recognitionResult.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🤖</div>
                    <p className="text-gray-500 dark:text-gray-400">
                      选择识别类型开始分析图片
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Notice */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 mt-0.5">ℹ️</div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  功能说明
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  这是一个演示版本，显示的是模拟数据。在实际应用中，需要集成专业的图像识别API（如Google Cloud Vision、Azure Computer Vision等）来实现真实的图像识别功能。
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">💡 使用技巧</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• 使用清晰、高分辨率的图片获得更好的识别效果</li>
              <li>• 文字识别建议使用对比度高、文字清晰的图片</li>
              <li>• 物体识别对光线条件和拍摄角度有一定要求</li>
              <li>• 支持中文、英文等多种语言的文字识别</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}