import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 代码块组件
interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, inline = false, ...props }) => {
  const [copied, setCopied] = React.useState(false);
  
  // 提取语言类型
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  
  // 复制代码功能
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (inline) {
    return (
      <code 
        className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      {/* 复制按钮 */}
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        title={copied ? '已复制' : '复制代码'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-300" />
        )}
      </button>
      
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="!mt-0 !mb-0 rounded-md"
        customStyle={{
          margin: 0,
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          lineHeight: '1.5'
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

// 自定义组件映射
const components = {
  // 代码块
  code: CodeBlock,
  
  // 标题样式
  h1: ({ children, ...props }: any) => (
    <h1 className="text-xl font-bold text-gray-900 mt-6 mb-4 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-lg font-semibold text-gray-900 mt-5 mb-3 first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-md font-medium text-gray-900 mt-4 mb-2 first:mt-0" {...props}>
      {children}
    </h3>
  ),
  
  // 段落样式
  p: ({ children, ...props }: any) => (
    <p className="text-gray-700 leading-relaxed mb-3 last:mb-0" {...props}>
      {children}
    </p>
  ),
  
  // 列表样式
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside space-y-1 mb-3 ml-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-1 mb-3 ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-gray-700" {...props}>
      {children}
    </li>
  ),
  
  // 链接样式
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-rose-600 hover:text-rose-700 underline decoration-rose-300 hover:decoration-rose-500 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  
  // 引用块样式
  blockquote: ({ children, ...props }: any) => (
    <blockquote 
      className="border-l-4 border-rose-300 pl-4 py-2 bg-rose-50 text-gray-700 italic mb-3"
      {...props}
    >
      {children}
    </blockquote>
  ),
  
  // 表格样式
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-900" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-gray-300 px-3 py-2 text-gray-700" {...props}>
      {children}
    </td>
  ),
  
  // 分隔线样式
  hr: (props: any) => (
    <hr className="border-t border-gray-300 my-4" {...props} />
  ),
  
  // 强调样式
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-gray-700" {...props}>
      {children}
    </em>
  ),
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;