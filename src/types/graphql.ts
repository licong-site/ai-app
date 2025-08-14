// GraphQL API types and client

export enum ChatRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}

export enum ResponseStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ChatMessageInput {
  role: ChatRole;
  content: string;
}

export interface SendMessageInput {
  message: string;
  messages?: ChatMessageInput[];
  userId?: string;
  sessionId?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatResponse {
  reply: string;
  status: ResponseStatus;
  timestamp: string;
  usage?: TokenUsage;
  error?: string;
  errorType?: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
}

export interface APIConfig {
  version: string;
  supportedModels: string[];
  maxTokens: number;
  timestamp: string;
}

// GraphQL 查询和变更
export const SEND_MESSAGE_MUTATION = `
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      reply
      status
      timestamp
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
      error
      errorType
    }
  }
`;

export const HEALTH_QUERY = `
  query Health {
    health {
      status
      timestamp
      version
    }
  }
`;

export const API_CONFIG_QUERY = `
  query APIConfig {
    apiConfig {
      version
      supportedModels
      maxTokens
      timestamp
    }
  }
`;
