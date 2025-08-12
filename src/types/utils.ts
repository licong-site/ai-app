// 工具类型定义文件
// 提供额外的类型安全保障和开发体验增强

// 深度只读类型
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 严格的事件处理类型
export type StrictEventHandler<T = Element, E = Event> = (event: E & { currentTarget: T }) => void;

// 组件 Props 基础类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

// 安全的数组索引访问类型
export type SafeArrayAccess<T> = T extends readonly (infer U)[] ? U | undefined : never;

// 排除 null 和 undefined 的类型
export type NonNullable<T> = T extends null | undefined ? never : T;

// 必需属性类型（将可选属性变为必需）
export type RequiredProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

// 部分必需属性类型
export type PartialRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

// 字符串字面量类型守卫
export const isStringLiteral = <T extends string>(
  value: string, 
  literals: readonly T[]
): value is T => {
  return literals.includes(value as T);
};

// 类型谓词函数
export const isValidMessage = (obj: unknown): obj is { content: string; role: string } => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'content' in obj &&
    'role' in obj &&
    typeof (obj as { content: unknown }).content === 'string' &&
    typeof (obj as { role: unknown }).role === 'string'
  );
};

// 环境变量类型定义
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  REACT_APP_API_URL?: string;
  REACT_APP_API_KEY?: string;
}

// 获取环境变量的类型安全函数
export const getEnvVar = (key: keyof EnvironmentVariables): string | undefined => {
  return process.env[key];
};

// 断言函数类型
export function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`);
  }
}

export function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error(`Expected number, got ${typeof value}`);
  }
}

// 错误类型定义
export class TypedError<T extends string = string> extends Error {
  constructor(
    public readonly type: T,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'TypedError';
  }
}

// API错误类型
export type APIErrorType = 
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR' 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export class APITypedError extends TypedError<APIErrorType> {
  constructor(
    type: APIErrorType,
    message: string,
    public readonly statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(type, message, details);
    this.name = 'APITypedError';
  }
}

// 异步状态类型
export type AsyncState<T, E = Error> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

// 创建异步状态的辅助函数
export const createAsyncState = {
  idle: (): AsyncState<never> => ({ status: 'idle' }),
  loading: (): AsyncState<never> => ({ status: 'loading' }),
  success: <T>(data: T): AsyncState<T> => ({ status: 'success', data }),
  error: <E = Error>(error: E): AsyncState<never, E> => ({ status: 'error', error }),
};

// React Hook 相关类型
export type UseStateReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export type UseEffectDependency = React.DependencyList | undefined;

// 组件引用类型
export type ComponentRef<T extends HTMLElement = HTMLElement> = React.RefObject<T>;

// 键盘事件处理类型
export type KeyboardEventHandler<T = Element> = (event: React.KeyboardEvent<T>) => void;

// 鼠标事件处理类型
export type MouseEventHandler<T = Element> = (event: React.MouseEvent<T>) => void;

// 表单事件处理类型
export type FormEventHandler<T = Element> = (event: React.FormEvent<T>) => void;

export type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void;