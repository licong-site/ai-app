export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatResponse {
  reply: string;
  error?: string;
}

// Button组件相关类型
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
export type ButtonVariant = 'default' | 'ghost' | 'outline';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
}

// ScrollArea组件类型
export interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

// ChatApp组件状态类型
export interface ChatAppState {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
}

// API相关类型
export interface APIError extends Error {
  status?: number;
  code?: string;
}

export interface SendMessageRequest {
  message: string;
  userId?: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  reply: string;
  status: 'success' | 'error';
  timestamp?: string;
  error?: string;
}