// API Functions
const sendMessageToAPI = async (message: string): Promise<string> => {
  try {
    // 使用自定义域名 API 端点
    const API_ENDPOINT = 'https://api.lcif2025.cc';
    
    const requestBody: SendMessageRequest = {
      message,
      // userId: 'optional-user-id',
      // sessionId: 'optional-session-id'
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  } catch (error) {
    console.error('API调用失败:', error);
    
    // 如果是 APIError，直接抛出
    if (error instanceof Error && 'errorType' in error) {
      throw error;
    }
    
    // 如果是网络错误，可能需要回退到演示模式
    console.warn('API服务不可用，使用演示模式');
    
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