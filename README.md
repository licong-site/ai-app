# AI Chat App 🤖💬

一个基于 React + TypeScript + Tailwind CSS 的现代化AI聊天应用，采用精美的粉色主题设计。

![AI Chat App](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.1-cyan) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 特性

- 🎨 **精美的粉色主题设计** - 温暖而现代的渐变配色
- 💬 **实时聊天界面** - 流畅的消息发送和接收体验
- 🔄 **智能加载状态** - 优雅的等待动画和状态提示
- 📱 **完全响应式设计** - 完美适配桌面端和移动端
- ⌨️ **键盘快捷键支持** - Enter发送，Shift+Enter换行
- 🎯 **TypeScript 类型安全** - 完整的类型定义和错误检查
- 🎭 **毛玻璃效果** - 现代化的UI视觉效果
- 🚀 **高性能** - 优化的React组件和状态管理

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
# 克隆项目
git clone https://github.com/licong-site/ai-app.git
cd ai-app

# 安装依赖
npm install
```

### 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

## 🔧 技术栈

| 技术 | 版本 | 描述 |
|------|------|------|
| **React** | 18.2.0 | 用户界面库 |
| **TypeScript** | 4.7.4 | 类型安全的JavaScript |
| **Tailwind CSS** | 3.1.6 | 实用工具优先的CSS框架 |
| **Lucide React** | 0.263.1 | 现代化图标库 |
| **PostCSS** | 8.4.14 | CSS处理工具 |

## 🔌 API 集成

项目预留了完整的API接口，支持快速集成后端服务：

### 修改API端点

在 `src/components/ChatApp.tsx` 中找到 `sendMessageToAPI` 函数：

```typescript
const sendMessageToAPI = async (message: string): Promise<string> => {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY', // 如需要
    },
    body: JSON.stringify({ 
      message,
      // 其他参数...
    }),
  });
  
  if (!response.ok) {
    throw new Error('API请求失败');
  }
  
  const data = await response.json();
  return data.reply;
};
```

## 📁 项目结构

```
src/
├── components/           # React组件
│   └── ChatApp.tsx      # 主要聊天组件
├── styles/              # 样式文件
│   └── globals.css      # 全局样式和Tailwind导入
├── types/               # TypeScript类型定义
│   └── index.ts         # 消息和API类型
├── App.tsx              # 应用根组件
└── index.tsx            # 入口文件
```

## 🎨 自定义主题

在 `tailwind.config.js` 中自定义颜色：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f2',
          500: '#f43f5e',
          600: '#e11d48',
        }
      }
    }
  }
}
```

## 📝 开发指南

### 添加新功能
1. 在 `src/components/` 中创建新组件
2. 在 `src/types/` 中定义相关类型
3. 更新主组件引用

### 部署到生产环境
```bash
npm run build
# 将 build/ 目录部署到你的服务器
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**享受编码时光！** 🎉