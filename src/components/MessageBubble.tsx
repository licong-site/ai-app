import React, {  } from 'react';
import { Bot, User } from 'lucide-react';
import { 
  Message} from '../types';

// 导入Markdown渲染组件
import MarkdownRenderer from './MarkdownRenderer';

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

export default MessageBubble; 
