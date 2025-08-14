import React, { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { 
  Message, 
  APIError
} from '../types';
import { sendMessageToGraphQLAPI } from '../utils/graphql';
// 导入Markdown渲染组件
import MessageInput from './MessageInput';
import ErrorBanner from './ErrorBanner';
import MessageBubble from './MessageBubble';
import ScrollArea from './ScrollArea';
import LoadingIndicator from './LoadingIndicator';

// 主聊天组件
const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是 **AI助手**，基于 DeepSeek 模型为您提供智能对话服务。\n\n我可以帮助您：\n- 回答各种问题\n- 提供代码示例\n- 解释复杂概念\n- 协助文档编写\n\n有什么可以帮助您的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; type?: string } | null>(null);
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
      let response = await sendMessageToGraphQLAPI(userMessage.content);
      
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
              </p>
            </div>
          </div>

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