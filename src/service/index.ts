import { APIError, SendMessageRequest, SendMessageResponse } from "../types";

// https://ai-service.licongcong-ok.workers.dev/
// http://api.lcif2025.cc/
// http://localhost:8787
const API_URL = 'http://localhost:8787';

export const sendMessage = async (message: string) => {
  // TODO: 替换为你的实际API端点
  const requestBody: SendMessageRequest = {
    message,
    // userId: 'optional-user-id',
    // sessionId: 'optional-session-id'
  };

  const response = await fetch(API_URL, {
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
    const apiError: APIError = new Error(data.error || '服务器返回错误');
    apiError.errorType = data.errorType;
    throw apiError;
  }
  
  return data.reply;
};
