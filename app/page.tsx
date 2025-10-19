"use client";

import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "智能压缩图片大小，保持最佳画质",
      icon: "🗜️",
      href: "/compress",
      color: "from-indigo-500 via-purple-500 to-pink-500",
      bgGradient: "from-indigo-50 to-purple-50"
    },
    {
      title: "抠图去背景",
      description: "一键去除图片背景，智能识别主体",
      icon: "✂️",
      href: "/remove-bg",
      color: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      title: "图片识别",
      description: "AI识别图片内容，提取文字信息",
      icon: "🔍",
      href: "/recognize",
      color: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgGradient: "from-violet-50 to-purple-50"
    },
    {
      title: "AI生图",
      description: "输入描述词，AI生成精美图片",
      icon: "🎨",
      href: "/generate",
      color: "from-rose-500 via-pink-500 to-fuchsia-500",
      bgGradient: "from-rose-50 to-pink-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Navigation */}
        <nav className="flex justify-between items-center mb-16 py-6">
          <div className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            图片AI工坊
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
              登录
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
              注册
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              AI驱动的
              <br />
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                图片处理平台
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium">
              集成最新AI技术，为您提供专业级的图片处理体验
              <br />
              <span className="text-lg text-slate-500 dark:text-slate-400">压缩 · 抠图 · 识别 · 生成，一站式解决方案</span>
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 animate-pulse hover:animate-none">
              开始体验 AI 魔法 ✨
            </button>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group relative h-full"
              >
                <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/50 hover:border-white/40 dark:hover:border-slate-600/50 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} dark:from-slate-800/50 dark:to-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>

                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform scale-110`}></div>
                    <div className={`relative text-5xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300 flex justify-center items-center h-16`}>
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium flex-grow">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-6 flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      立即使用
                    </span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center text-lg">
                  ⚡
                </div>
                <h4 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">闪电般速度</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  先进的AI算法优化，毫秒级响应
                </p>
              </div>

              <div className="text-center p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-violet-400 to-purple-400 rounded-xl flex items-center justify-center text-lg">
                  🛡️
                </div>
                <h4 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">隐私至上</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  端到端加密处理，数据安全保障
                </p>
              </div>

              <div className="text-center p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center text-lg">
                  🎯
                </div>
                <h4 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">专业品质</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  业界领先的AI模型，专业标准
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="mb-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  开发者信息
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info - Compact */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-slate-200/30 dark:border-slate-600/30">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center text-sm">
                      💬
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">微信</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Huangtaozi188</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-slate-200/30 dark:border-slate-600/30">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-sm">
                      📱
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">公众号</div>
                      <a
                        href="https://mp.weixin.qq.com/s/WpoCsXTouErE3BVoCDlPWg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        黄桃子聊AI
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-slate-200/30 dark:border-slate-600/30">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-sm">
                      🌐
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">知乎</div>
                      <a
                        href="https://www.zhihu.com/people/huang-a-bin-90"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                      >
                        技术分享空间
                      </a>
                    </div>
                  </div>
                </div>

                {/* WeChat QR Code - Compact */}
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="relative p-4 bg-white/70 dark:bg-slate-700/70 rounded-xl shadow-lg border border-white/40 dark:border-slate-600/40">
                      <img
                        src="/images/wechat-qr.jpg"
                        alt="微信二维码"
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <div className="w-24 h-24 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-xs text-slate-500 dark:text-slate-400" style={{display: 'none'}}>
                        微信二维码
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      扫码添加微信
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6">
          <div className="border-t border-slate-200/30 dark:border-slate-700/30 pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; 2024 图片AI工坊 · 由黄桃子精心打造 · Powered by Next.js & AI
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
