import { APIError, SendMessageRequest, SendMessageResponse } from "../types";

// API 配置
// 开发环境 vs 生产环境
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000/api'  // 本地开发时的代理路径
  : '/api';                      // 生产环境使用相对路径（同域）

// 备用 API URL（用于调试或回退）
// const FALLBACK_API_URL = 'https://api.lcif2025.cc/';

/**
 * 发送消息到 AI API
 * @param message 用户消息内容
 * @returns AI 回复内容
 * @throws {APIError} 当 API 调用失败时抛出错误
 */
export const sendMessageToAPI = async (message: string): Promise<string> => {
  const requestBody: SendMessageRequest = {
    message,
    // userId: 'optional-user-id',
    // sessionId: 'optional-session-id'
  };

  try {
    console.log(`Sending request to: ${API_BASE_URL}`);
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // 检查 HTTP 状态码
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorType = 'HTTP_ERROR';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        errorType = errorData.errorType || 'HTTP_ERROR';
      } catch {
        // 如果无法解析错误响应，使用默认错误信息
      }
      
      const apiError: APIError = new Error(errorMessage);
      apiError.errorType = errorType;
      throw apiError;
    }

    const data: SendMessageResponse = await response.json();
    
    // 检查 API 响应状态
    if (data.status === 'error') {
      const apiError: APIError = new Error(data.error || 'API 返回错误');
      apiError.errorType = data.errorType || 'API_ERROR';
      throw apiError;
    }
    
    return data.reply;
    
  } catch (error) {
    console.error('API 调用失败:', error);
    
    // 如果是网络错误或其他未知错误，包装成 APIError
    if (!(error instanceof Error) || !('errorType' in error)) {
      const apiError: APIError = new Error(
        error instanceof Error ? error.message : '网络请求失败，请检查网络连接'
      );
      apiError.errorType = 'NETWORK_ERROR';
      throw apiError;
    }
    
    // 重新抛出已经是 APIError 的错误
    throw error;
  }
};

/**
 * 健康检查 API
 * @returns Promise<boolean> API 是否可用
 */
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * 获取 API 配置信息（用于调试）
 */
export const getAPIConfig = () => {
  return {
    baseUrl: API_BASE_URL,
    isDevelopment,
    timestamp: new Date().toISOString(),
  };
};
