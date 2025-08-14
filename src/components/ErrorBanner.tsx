import React, {  } from 'react';
import { AlertCircle } from 'lucide-react';

// 导入Markdown渲染组件

// 错误提示组件
interface ErrorBannerProps {
  error: string;
  errorType?: string;
  onDismiss: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, errorType, onDismiss }) => {
  const getErrorConfig = (errorType?: string) => {
    switch (errorType) {
      case 'INSUFFICIENT_BALANCE':
        return {
          title: '余额不足',
          description: error,
          action: {
            text: '前往充值',
            url: 'https://platform.deepseek.com/usage'
          },
          className: 'bg-orange-50 border-orange-200 text-orange-800'
        };
      case 'INVALID_API_KEY':
        return {
          title: 'API密钥错误',
          description: error,
          className: 'bg-red-50 border-red-200 text-red-800'
        };
      case 'RATE_LIMIT_EXCEEDED':
        return {
          title: '请求过于频繁',
          description: error,
          className: 'bg-yellow-50 border-yellow-200 text-yellow-800'
        };
      case 'GRAPHQL_ERROR':
        return {
          title: 'GraphQL 请求错误',
          description: error,
          className: 'bg-purple-50 border-purple-200 text-purple-800'
        };
      case 'NETWORK_ERROR':
        return {
          title: '网络连接错误',
          description: error,
          className: 'bg-blue-50 border-blue-200 text-blue-800'
        };
      default:
        return {
          title: '服务异常',
          description: error,
          className: 'bg-red-50 border-red-200 text-red-800'
        };
    }
  };

  const config = getErrorConfig(errorType);

  return (
    <div className={`border rounded-lg p-4 mb-4 ${config.className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium">{config.title}</h4>
          <p className="text-sm mt-1">{config.description}</p>
          {config.action && (
            <div className="mt-2">
              <a 
                href={config.action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                {config.action.text}
              </a>
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-lg leading-none hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorBanner;
