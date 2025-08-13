import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
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

// 代码块组件的类型定义
interface CodeProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  node?: any;
}

const CodeBlock: React.FC<CodeProps> = ({ 
  children, 
  className, 
  inline = false, 
  ...props 
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);
  
  // 提取语言类型
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  
  // 复制代码功能
  const copyToClipboard = async (): Promise<void> => {
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
    <div className="relative group my-3">
      {/* 复制按钮 */}
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        title={copied ? '已复制' : '复制代码'}
        type="button"
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

// 标题组件类型
interface HeadingProps {
  children?: React.ReactNode;
  node?: any;
}

// 段落组件类型
interface ParagraphProps {
  children?: React.ReactNode;
  node?: any;
}

// 列表组件类型
interface ListProps {
  children?: React.ReactNode;
  ordered?: boolean;
  node?: any;
}

// 列表项组件类型
interface ListItemProps {
  children?: React.ReactNode;
  checked?: boolean | null;
  index?: number;
  ordered?: boolean;
  node?: any;
}

// 链接组件类型
interface LinkProps {
  children?: React.ReactNode;
  href?: string;
  title?: string;
  node?: any;
}

// 引用块组件类型
interface BlockquoteProps {
  children?: React.ReactNode;
  node?: any;
}

// 表格相关组件类型
interface TableProps {
  children?: React.ReactNode;
  node?: any;
}

interface TableHeadProps {
  children?: React.ReactNode;
  node?: any;
}

interface TableCellProps {
  children?: React.ReactNode;
  isHeader?: boolean;
  node?: any;
}

// 其他组件类型
interface HrProps {
  node?: any;
}

interface EmphasisProps {
  children?: React.ReactNode;
  node?: any;
}

interface StrongProps {
  children?: React.ReactNode;
  node?: any;
}

interface DeleteProps {
  children?: React.ReactNode;
  node?: any;
}

interface InputProps {
  checked?: boolean;
  type?: string;
  node?: any;
}

// 自定义组件映射
const components: Components = {
  // 代码块
  code: CodeBlock,
  
  // 标题样式 - 针对消息场景调整大小
  h1: ({ children, ...props }: HeadingProps) => (
    <h1 className="text-lg font-bold text-gray-900 mt-4 mb-3 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: HeadingProps) => (
    <h2 className="text-base font-semibold text-gray-900 mt-3 mb-2 first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps) => (
    <h3 className="text-sm font-medium text-gray-900 mt-3 mb-2 first:mt-0" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: HeadingProps) => (
    <h4 className="text-sm font-medium text-gray-800 mt-2 mb-1 first:mt-0" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: HeadingProps) => (
    <h5 className="text-sm font-medium text-gray-800 mt-2 mb-1 first:mt-0" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: HeadingProps) => (
    <h6 className="text-sm font-medium text-gray-800 mt-2 mb-1 first:mt-0" {...props}>
      {children}
    </h6>
  ),
  
  // 段落样式 - 减少间距
  p: ({ children, ...props }: ParagraphProps) => (
    <p className="text-gray-700 leading-relaxed mb-2 last:mb-0" {...props}>
      {children}
    </p>
  ),
  
  // 列表样式 - 针对消息场景调整
  ul: ({ children, ...props }: ListProps) => (
    <ul className="list-disc list-inside space-y-1 mb-2 ml-3" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ListProps) => (
    <ol className="list-decimal list-inside space-y-1 mb-2 ml-3" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps) => (
    <li className="text-gray-700 text-sm" {...props}>
      {children}
    </li>
  ),
  
  // 链接样式
  a: ({ children, href, ...props }: LinkProps) => (
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
  
  // 引用块样式 - 减少内边距
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote 
      className="border-l-4 border-rose-300 pl-3 py-1 bg-rose-50/50 text-gray-700 italic mb-2 text-sm"
      {...props}
    >
      {children}
    </blockquote>
  ),
  
  // 表格样式 - 适配小尺寸
  table: ({ children, ...props }: TableProps) => (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: TableHeadProps) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: TableCellProps) => (
    <th className="border border-gray-300 px-2 py-1 text-left font-medium text-gray-900 text-xs" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: TableCellProps) => (
    <td className="border border-gray-300 px-2 py-1 text-gray-700 text-xs" {...props}>
      {children}
    </td>
  ),
  
  // 分隔线样式
  hr: (props: HrProps) => (
    <hr className="border-t border-gray-300 my-3" {...props} />
  ),
  
  // 强调样式
  strong: ({ children, ...props }: StrongProps) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: EmphasisProps) => (
    <em className="italic text-gray-700" {...props}>
      {children}
    </em>
  ),
  
  // 删除线
  del: ({ children, ...props }: DeleteProps) => (
    <del className="line-through text-gray-500" {...props}>
      {children}
    </del>
  ),
  
  // 任务列表
  input: ({ checked, ...props }: InputProps) => (
    <input
      type="checkbox"
      checked={checked || false}
      readOnly
      className="mr-2 accent-rose-500"
      {...props}
    />
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