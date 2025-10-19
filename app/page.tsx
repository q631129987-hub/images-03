import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "智能压缩图片大小，保持最佳画质",
      icon: "🗜️",
      href: "/compress",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "抠图去背景",
      description: "一键去除图片背景，智能识别主体",
      icon: "✂️",
      href: "/remove-bg",
      color: "from-green-500 to-green-600"
    },
    {
      title: "图片识别",
      description: "AI识别图片内容，提取文字信息",
      icon: "🔍",
      href: "/recognize",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "AI生图",
      description: "输入描述词，AI生成精美图片",
      icon: "🎨",
      href: "/generate",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            图片处理工具
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的在线图片处理平台，提供压缩、抠图、识别、AI生图等多种功能
          </p>
        </header>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">快速处理</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                高效的处理算法，几秒钟完成图片处理
              </p>
            </div>
            <div className="p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">隐私安全</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                所有处理在本地完成，保护您的隐私
              </p>
            </div>
            <div className="p-6">
              <div className="text-3xl mb-3">💎</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">免费使用</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                完全免费，无需注册，即开即用
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
