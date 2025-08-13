// Cloudflare Pages Functions - API 代理
// 处理所有 /api/* 请求，转发到现有的 Worker

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 提取 API 路径（移除 /api 前缀）
  const apiPath = url.pathname.replace('/api', '');
  
  // 如果路径为空，设置默认路径
  const finalPath = apiPath || '/';
  
  // 转发到你现有的 Worker
  const workerUrl = `https://ai-service.licongcong-ok.workers.dev${finalPath}${url.search}`;
  
  console.log(`Proxying request to: ${workerUrl}`);
  
  try {
    // 复制请求头，但排除一些可能有问题的头部
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      // 跳过这些头部，让 fetch 自动处理
      if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }
    
    const response = await fetch(workerUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });
    
    // 复制响应头
    const responseHeaders = {};
    for (const [key, value] of response.headers.entries()) {
      responseHeaders[key] = value;
    }
    
    // 返回响应，无需添加 CORS 头部（同域请求）
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('API proxy error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'API request failed',
      message: error.message,
      workerUrl: workerUrl
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json'
      },
    });
  }
}