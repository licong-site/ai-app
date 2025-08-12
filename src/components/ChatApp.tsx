import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { 
  Message, 
  ButtonProps, 
  ScrollAreaProps, 
  APIError,
  SendMessageRequest,
  SendMessageResponse,
  ButtonSize,
  ButtonVariant 
} from '../types';

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

// API Functions
const sendMessageToAPI = async (message: string): Promise<string> => {
  try {
    // TODO: 替换为你的实际API端点
    const requestBody: SendMessageRequest = {
      message,
      // userId: 'optional-user-id',
      // sessionId: 'optional-session-id'
    };

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_API_KEY', // 如需要
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error: APIError = new Error(`API请求失败: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const data: SendMessageResponse = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.error || '服务器返回错误');
    }
    
    return data.reply;
  } catch (error) {
    console.error('API调用失败:', error);
    
    // 模拟API调用（演示用）- 生产环境中应该移除
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses: string[] = [
      "这是一个很有趣的问题！让我来为你详细解答...",
      "根据我的理解，我认为这个问题可以从几个角度来看：",
      "感谢你的提问。基于现有信息，我建议...",
      "这确实是一个值得探讨的话题。从我的角度来看...",
      "我理解你的疑问。让我尝试用更简单的方式来解释..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " " + "这里是AI助手的详细回复内容，会根据你的具体问题提供相应的帮助和建议。";
  }
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
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
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
const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-rose-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">AI正在思考中...</span>
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
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isLoading) return;

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
      const response = await sendMessageToAPI(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，消息发送失败，请稍后重试。',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-rose-600">智能助手，随时为你解答</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && <LoadingIndicator />}

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