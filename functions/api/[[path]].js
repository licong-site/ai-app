// Cloudflare Pages Functions - API 代理
// 处理所有 /api/* 请求，转发到现有的 Worker

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 提取路径，移除 /api 前缀
  const path = url.pathname.replace(/^\/api/, '');
  
  // 构建后端 URL
  const backendUrl = 'https://ai-service.licongcong-ok.workers.dev';
  let targetUrl;
  
  // 根据路径决定目标端点
  if (path === '/graphql' || path.startsWith('/graphql')) {
    // GraphQL 请求
    targetUrl = `${backendUrl}/graphql`;
  } else if (path === '/health') {
    // 健康检查
    targetUrl = `${backendUrl}/health`;
  } else {
    // REST API 请求（默认根路径）
    targetUrl = `${backendUrl}/`;
  }
  
  // 转发到你现有的 Worker
  // const workerUrl = `https://ai-service.licongcong-ok.workers.dev${finalPath}${url.search}`;
  
  console.log(`🍎🍎🍎🍎🍎🍎 Proxying request to: ${targetUrl}`);

  // 复制请求
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  
  try {
    // 转发请求到后端
    const response = await fetch(modifiedRequest);
    
    // 复制响应
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    
    // 添加 CORS 头
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return modifiedResponse;
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Proxy request failed',
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}