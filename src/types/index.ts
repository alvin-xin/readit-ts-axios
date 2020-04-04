/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-27
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-27
 */
export type Method = 'get' | 'GET' | 'delete' | "DELETE" | "head" | "HEAD" | 'options' | "OPTIONS" | 'post' | "POST" | 'put' | "PUT" | 'patch' | "PATCH";

// 定义Axios类的公共方法
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?: AxiosRequestConfig): string
}

// 继承自Axios类，属于混合类型接口
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any

  // XMLHttpRequest.responseType 属性是一个枚举类型的属性，返回响应数据的类型。它允许我们手动的设置返回数据的类型。如果我们将它设置为一个空字符串，它将使用默认的"text"类型。
  responseType?: XMLHttpRequestResponseType

  timeout?: number

  // 在合并默认的参数和初始化参数的时候，会通过config[key]的方式访问，所以需要加上这样一个字符串索引签名
  [propName: string]: any

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  cancelToken?: CancelToken

  withCredentials?: boolean

  // xsrfCookieName 表示存储 token 的 cookie 名称
  xsrfCookieName?: string
  // xsrfHeaderName 表示请求 headers 中 token 对应的 header 名称
  xsrfHeaderName?: string

  // 上传进度
  onDownloadProgress?: (e: ProgressEvent) => void
  // 下载进度
  onUploadProgress?: (e: ProgressEvent) => void

  auth?: AxiosBasicCredentials

  validateStatus?: (status: number) => boolean

  paramsSerializer?: (params: any) => string

  baseURL?: string
}


export interface AxiosBasicCredentials {
  username: string
  password: string
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

// 处理响应为promise对象
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T=any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance;

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>

  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R

  Axios: AxiosClassStatic
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}
