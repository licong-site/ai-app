import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Button from './Button';

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

export default MessageInput;
