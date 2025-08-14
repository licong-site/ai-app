import { GraphQLClient, request } from 'graphql-request';
import { 
  SEND_MESSAGE_MUTATION, 
  HEALTH_QUERY, 
  API_CONFIG_QUERY,
  SendMessageInput,
  ChatResponse,
  HealthStatus,
  APIConfig,
  ResponseStatus,
  ChatRole
} from '../types/graphql';
import { APIError } from '../types';

// API 配置
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? 'https://ai-service.licongcong-ok.workers.dev/graphql'  // 开发环境
  : '/api/graphql';                                          // 生产环境

// 创建 GraphQL 客户端
const graphQLClient = new GraphQLClient(API_BASE_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
  // 错误处理
  errorPolicy: 'all',
});

/**
 * 发送消息到 AI API (GraphQL)
 * @param message 用户消息内容
 * @returns AI 回复内容
 * @throws {APIError} 当 API 调用失败时抛出错误
 */
export const sendMessageToGraphQLAPI = async (message: string): Promise<string> => {
  const input: SendMessageInput = {
    message,
    // 可以根据需要添加其他参数
    // userId: 'optional-user-id',
    // sessionId: 'optional-session-id',
    // model: 'deepseek-chat',
    // temperature: 0.7,
    // maxTokens: 2048
  };

  try {
    console.log(`Sending GraphQL request to: ${API_BASE_URL}`);
    
    const response = await request<{ sendMessage: ChatResponse }>(
      API_BASE_URL,
      SEND_MESSAGE_MUTATION,
      { input }
    );

    const chatResponse = response.sendMessage;
    
    // 检查 GraphQL 响应状态
    if (chatResponse.status === ResponseStatus.ERROR) {
      const apiError: APIError = new Error(chatResponse.error || 'GraphQL API 返回错误');
      apiError.errorType = chatResponse.errorType || 'GRAPHQL_ERROR';
      throw apiError;
    }
    
    return chatResponse.reply;
    
  } catch (error) {
    console.error('GraphQL API 调用失败:', error);
    
    // 处理 GraphQL 错误
    if (error && typeof error === 'object' && 'response' in error) {
      const graphQLError = error as any;
      
      // 检查是否有 GraphQL 错误
      if (graphQLError.response?.errors) {
        const firstError = graphQLError.response.errors[0];
        const apiError: APIError = new Error(firstError.message || 'GraphQL 查询错误');
        apiError.errorType = 'GRAPHQL_ERROR';
        throw apiError;
      }
      
      // 检查是否有数据但状态为错误
      if (graphQLError.response?.data?.sendMessage?.status === ResponseStatus.ERROR) {
        const chatResponse = graphQLError.response.data.sendMessage;
        const apiError: APIError = new Error(chatResponse.error || 'GraphQL API 返回错误');
        apiError.errorType = chatResponse.errorType || 'GRAPHQL_ERROR';
        throw apiError;
      }
    }
    
    // 如果是网络错误或其他未知错误，包装成 APIError
    if (!(error instanceof Error) || !('errorType' in error)) {
      const apiError: APIError = new Error(
        error instanceof Error ? error.message : 'GraphQL 网络请求失败，请检查网络连接'
      );
      apiError.errorType = 'NETWORK_ERROR';
      throw apiError;
    }
    
    // 重新抛出已经是 APIError 的错误
    throw error;
  }
};

/**
 * 健康检查 API (GraphQL)
 * @returns Promise<boolean> API 是否可用
 */
export const checkGraphQLAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await request<{ health: HealthStatus }>(
      API_BASE_URL,
      HEALTH_QUERY
    );
    
    return response.health.status === 'OK';
  } catch {
    return false;
  }
};

/**
 * 获取 API 配置信息 (GraphQL)
 */
export const getGraphQLAPIConfig = async (): Promise<APIConfig> => {
  try {
    const response = await request<{ apiConfig: APIConfig }>(
      API_BASE_URL,
      API_CONFIG_QUERY
    );
    
    return response.apiConfig;
  } catch (error) {
    console.error('获取 API 配置失败:', error);
    throw error;
  }
};

/**
 * 使用 GraphQL 客户端实例发送复杂查询
 * 适用于需要自定义 headers 或其他配置的场景
 */
export const sendMessageWithClient = async (
  message: string,
  options?: {
    userId?: string;
    sessionId?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> => {
  const input: SendMessageInput = {
    message,
    userId: options?.userId,
    sessionId: options?.sessionId,
    model: options?.model,
    temperature: options?.temperature,
    maxTokens: options?.maxTokens,
  };

  try {
    const response = await graphQLClient.request<{ sendMessage: ChatResponse }>(
      SEND_MESSAGE_MUTATION,
      { input }
    );

    const chatResponse = response.sendMessage;
    
    if (chatResponse.status === ResponseStatus.ERROR) {
      const apiError: APIError = new Error(chatResponse.error || 'GraphQL API 返回错误');
      apiError.errorType = chatResponse.errorType || 'GRAPHQL_ERROR';
      throw apiError;
    }
    
    return chatResponse.reply;
    
  } catch (error) {
    console.error('GraphQL 客户端调用失败:', error);
    
    if (!(error instanceof Error) || !('errorType' in error)) {
      const apiError: APIError = new Error(
        error instanceof Error ? error.message : 'GraphQL 客户端请求失败'
      );
      apiError.errorType = 'GRAPHQL_CLIENT_ERROR';
      throw apiError;
    }
    
    throw error;
  }
};

/**
 * 获取 GraphQL 客户端配置信息（用于调试）
 */
export const getGraphQLClientConfig = () => {
  return {
    endpoint: API_BASE_URL,
    isDevelopment,
    timestamp: new Date().toISOString(),
  };
};
