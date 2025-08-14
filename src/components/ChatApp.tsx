import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Settings } from 'lucide-react';
import { 
  Message, 
  ButtonProps, 
  ScrollAreaProps, 
  ButtonSize,
  ButtonVariant, 
  APIError
} from '../types';

// 导入API函数
import { sendMessageToAPI } from '../utils/api';
import { sendMessageToGraphQLAPI } from '../utils/graphql';
// 导入Markdown渲染组件
import MarkdownRenderer from './MarkdownRenderer';

// UI Components
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  size = 'default', 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const sizeStyles: Record<ButtonSize, string> = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };
  
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-rose-500 text-white hover:bg-rose-600',
    ghost: 'hover:bg-rose-50 hover:text-rose-700',
    outline: 'border border-rose-200 hover:bg-rose-50 hover:text-rose-700'
  };
  
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="h-full w-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

// API 切换组件
interface APIToggleProps {
  useGraphQL: boolean;
  onToggle: (useGraphQL: boolean) => void;
}

const APIToggle: React.FC<APIToggleProps> = ({ useGraphQL, onToggle }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200">
      <Settings className="w-4 h-4 text-rose-600" />
      <span className="text-sm text-gray-700">API:</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggle(false)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            !useGraphQL 
              ? 'bg-rose-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          REST
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            useGraphQL 
              ? 'bg-rose-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          GraphQL
        </button>
      </div>
    </div>
  );
};

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

// 消息组件
interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white'
            : 'bg-white/90 backdrop-blur-sm border border-rose-100 text-gray-900'
        }`}
      >
        <div className="text-sm leading-relaxed">
          {isUser ? (
            // 用户消息保持原有的显示方式
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            // AI回复使用Markdown渲染
            <MarkdownRenderer 
              content={message.content} 
              className="ai-message-content"
            />
          )}
        </div>
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-rose-100' : 'text-rose-500'
          }`}
        >
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

// 加载指示器组件
interface LoadingIndicatorProps {
  useGraphQL: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ useGraphQL }) => {
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
            <span className="text-xs ml-2 opacity-75">
              ({useGraphQL ? 'GraphQL' : 'REST'})
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

// 输入区域组件
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  disabled 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-rose-200 px-4 py-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (Enter发送，Shift+Enter换行)"
              className="w-full resize-none border border-rose-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white/90 backdrop-blur-sm"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={disabled}
            />
          </div>
          <Button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            size="icon"
            className="h-12 w-12 bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 主聊天组件
const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是 **AI助手**，基于 DeepSeek 模型为您提供智能对话服务。\\n\\n我可以帮助您：\\n- 回答各种问题\\n- 提供代码示例\\n- 解释复杂概念\\n- 协助文档编写\\n\\n现在支持 **REST API** 和 **GraphQL** 两种接口方式，您可以通过右上角的开关来切换。\\n\\n有什么可以帮助您的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; type?: string } | null>(null);
  const [useGraphQL, setUseGraphQL] = useState<boolean>(false); // GraphQL 开关
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isLoading) return;

    // 清除之前的错误
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let response: string;
      
      // 根据开关选择使用 REST API 还是 GraphQL
      if (useGraphQL) {
        response = await sendMessageToGraphQLAPI(userMessage.content);
      } else {
        response = await sendMessageToAPI(userMessage.content);
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 显示错误信息
      if (error instanceof Error && 'errorType' in error) {
        const apiError = error as APIError;
        setError({
          message: apiError.message,
          type: apiError.errorType || 'UNKNOWN_ERROR'
        });
      } else {
        setError({
          message: '发送消息失败，请稍后重试。',
          type: 'UNKNOWN_ERROR'
        });
      }
      
      // 不添加错误消息到聊天记录，让用户重试
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = (): void => {
    setError(null);
  };

  const handleAPIToggle = (shouldUseGraphQL: boolean): void => {
    setUseGraphQL(shouldUseGraphQL);
    // 可以在这里添加一些提示或者日志
    console.log(`切换到 ${shouldUseGraphQL ? 'GraphQL' : 'REST'} API`);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">DeepSeek AI Assistant</h1>
              <p className="text-sm text-rose-600">
                支持 Markdown 渲染的智能助手 
                <span className="ml-2 text-xs">
                  ({useGraphQL ? 'GraphQL' : 'REST'} API)
                </span>
              </p>
            </div>
          </div>
          
          {/* API 切换开关 */}
          <APIToggle useGraphQL={useGraphQL} onToggle={handleAPIToggle} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* 错误提示 */}
            {error && (
              <ErrorBanner
                error={error.message}
                errorType={error.type || 'UNKNOWN_ERROR'}
                onDismiss={dismissError}
              />
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && <LoadingIndicator useGraphQL={useGraphQL} />}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
};

export default ChatApp;