// Markdown 相关的类型定义

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// React Markdown 组件的基础 Props 类型
export interface BaseMarkdownProps {
  children?: React.ReactNode;
  node?: any;
}

// 代码块组件的 Props 类型
export interface CodeProps extends BaseMarkdownProps {
  className?: string;
  inline?: boolean;
}

// 标题组件的 Props 类型
export interface HeadingProps extends BaseMarkdownProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// 段落组件的 Props 类型
export interface ParagraphProps extends BaseMarkdownProps {}

// 列表组件的 Props 类型
export interface ListProps extends BaseMarkdownProps {
  ordered?: boolean;
  start?: number;
  tight?: boolean;
}

// 列表项组件的 Props 类型
export interface ListItemProps extends BaseMarkdownProps {
  checked?: boolean | null;
  index?: number;
  ordered?: boolean;
  tight?: boolean;
}

// 链接组件的 Props 类型
export interface LinkProps extends BaseMarkdownProps {
  href?: string;
  title?: string;
}

// 图片组件的 Props 类型
export interface ImageProps extends BaseMarkdownProps {
  src?: string;
  alt?: string;
  title?: string;
}

// 引用块组件的 Props 类型
export interface BlockquoteProps extends BaseMarkdownProps {}

// 表格相关组件的 Props 类型
export interface TableProps extends BaseMarkdownProps {}

export interface TableHeadProps extends BaseMarkdownProps {}

export interface TableBodyProps extends BaseMarkdownProps {}

export interface TableRowProps extends BaseMarkdownProps {}

export interface TableCellProps extends BaseMarkdownProps {
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
}

// 分隔线组件的 Props 类型
export interface HrProps {
  node?: any;
}

// 强调和粗体组件的 Props 类型
export interface EmphasisProps extends BaseMarkdownProps {}

export interface StrongProps extends BaseMarkdownProps {}

export interface DeleteProps extends BaseMarkdownProps {}

// 输入框组件的 Props 类型（任务列表）
export interface InputProps {
  checked?: boolean;
  type?: string;
  disabled?: boolean;
  node?: any;
}

// 代码高亮的语言类型
export type SupportedLanguage = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'go'
  | 'rust'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'scala'
  | 'r'
  | 'sql'
  | 'html'
  | 'css'
  | 'scss'
  | 'less'
  | 'json'
  | 'xml'
  | 'yaml'
  | 'markdown'
  | 'bash'
  | 'shell'
  | 'powershell'
  | 'dockerfile'
  | 'nginx'
  | 'apache'
  | 'tex'
  | 'latex';

// 代码复制功能的状态类型
export interface CopyState {
  copied: boolean;
  timeout?: NodeJS.Timeout;
}

// Markdown 插件配置类型
export interface MarkdownPluginConfig {
  remarkPlugins?: any[];
  rehypePlugins?: any[];
  skipHtml?: boolean;
}

// Markdown 主题配置类型
export interface MarkdownThemeConfig {
  codeTheme?: any;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  borderColor?: string;
}

// 完整的 Markdown 配置类型
export interface MarkdownConfig extends MarkdownPluginConfig {
  theme?: MarkdownThemeConfig;
  enableCopyCode?: boolean;
  enableLineNumbers?: boolean;
  maxCodeBlockHeight?: number;
}

// Markdown 渲染错误类型
export interface MarkdownRenderError extends Error {
  component?: string;
  originalError?: Error;
}

// 自定义 Hook 返回类型
export interface UseMarkdownCopy {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

// 表格对齐类型
export type TableAlign = 'left' | 'center' | 'right' | null;

// Markdown AST 节点类型（简化版）
export interface MarkdownNode {
  type: string;
  children?: MarkdownNode[];
  value?: string;
  lang?: string;
  meta?: string;
  url?: string;
  title?: string;
  alt?: string;
  align?: TableAlign[];
  ordered?: boolean;
  start?: number;
  tight?: boolean;
  checked?: boolean | null;
  depth?: number;
}