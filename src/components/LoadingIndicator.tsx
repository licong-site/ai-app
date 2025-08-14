import { Bot, Loader2 } from 'lucide-react';

// 加载指示器组件
const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-rose-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">
            AI正在思考中...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
