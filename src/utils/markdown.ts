import { useState, useCallback } from 'react';
import { UseMarkdownCopy } from '../types/markdown';

/**
 * 自定义 Hook：处理 Markdown 代码块的复制功能
 * @returns {UseMarkdownCopy} 包含复制状态和复制函数的对象
 */
export const useMarkdownCopy = (): UseMarkdownCopy => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      // 检查浏览器是否支持 clipboard API
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not supported');
      }

      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // 2秒后重置状态
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
      
      // 降级方案：使用传统的复制方法
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackError) {
        console.error('降级复制方案也失败了:', fallbackError);
      }
    }
  }, []);

  return {
    copied,
    copyToClipboard,
  };
};

/**
 * 检测语言类型的工具函数
 * @param className - 代码块的 className
 * @returns {string} 语言类型
 */
export const detectLanguage = (className?: string): string => {
  if (!className) return '';
  
  const match = /language-(\w+)/.exec(className);
  return match ? match[1] : '';
};

/**
 * 格式化代码内容的工具函数
 * @param content - 原始代码内容
 * @returns {string} 格式化后的代码内容
 */
export const formatCodeContent = (content: React.ReactNode): string => {
  return String(content).replace(/\n$/, '');
};

/**
 * 验证是否为支持的编程语言
 * @param language - 语言标识
 * @returns {boolean} 是否为支持的语言
 */
export const isSupportedLanguage = (language: string): boolean => {
  const supportedLanguages = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
    'php', 'go', 'rust', 'ruby', 'swift', 'kotlin', 'scala', 'r',
    'sql', 'html', 'css', 'scss', 'less', 'json', 'xml', 'yaml',
    'markdown', 'bash', 'shell', 'powershell', 'dockerfile', 'nginx',
    'apache', 'tex', 'latex'
  ];
  
  return supportedLanguages.includes(language.toLowerCase());
};

/**
 * 生成代码块的唯一 ID
 * @param content - 代码内容
 * @param language - 语言类型
 * @returns {string} 唯一标识符
 */
export const generateCodeBlockId = (content: string, language: string): string => {
  const hash = btoa(encodeURIComponent(content + language))
    .replace(/[+/=]/g, '')
    .substring(0, 8);
  return `code-block-${hash}`;
};

/**
 * 获取语言显示名称的工具函数
 * @param language - 语言标识
 * @returns {string} 显示名称
 */
export const getLanguageDisplayName = (language: string): string => {
  const languageMap: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'csharp': 'C#',
    'php': 'PHP',
    'go': 'Go',
    'rust': 'Rust',
    'ruby': 'Ruby',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'scala': 'Scala',
    'r': 'R',
    'sql': 'SQL',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'less': 'Less',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'markdown': 'Markdown',
    'bash': 'Bash',
    'shell': 'Shell',
    'powershell': 'PowerShell',
    'dockerfile': 'Dockerfile',
    'nginx': 'Nginx',
    'apache': 'Apache',
    'tex': 'TeX',
    'latex': 'LaTeX'
  };
  
  return languageMap[language.toLowerCase()] || language.toUpperCase();
};