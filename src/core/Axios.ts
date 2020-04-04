/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
import { AxiosPromise, AxiosRequestConfig, AxiosResponse, Method, RejectedFn, ResolvedFn } from '../types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './IntercepyorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>,
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise),
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig;
  interceptors: Interceptors;

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      // 请求拦截器， 主要用于对requestConfig参数进行前置拦截器处理
      request: new InterceptorManager<AxiosRequestConfig>(),
      // 响应拦截器， 主要用于请求返回之后的response对象拦截器后置处理
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  // axios函数实际上是指向request函数
  request(url: any, config?: any): AxiosPromise {
    // 对request请求的重构函数处理， 保证能够做到传入一个或者两个参数进行发起请求
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    // 合并默认的配置对象
    config = mergeConfig(this.defaults, config);
    config.method = config.method.toLowerCase()

    // 首先，构造一个PromsieChain类型的数组chain，并把dispatchRequest函数赋值给resolved属性
    const chain: PromiseChain[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    // 遍历请求拦截器插入到chain前面当中
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor);
    })

    // 遍历响应拦截器插入到chain后面当中
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    // 定义一个resolve的promise对象
    let promise = Promise.resolve(config)

    // 开始循环chain，并把其中的resolve和reject函数添加到promise.then参数当中，
    // 通过这样的方式实现promise的链式调用，实现拦截器一层层的链式调用效果
    // 注意： 请求拦截器（先执行后面添加的，在执行先添加的），响应拦截器（先执行先添加的，后执行后添加的）
    while(chain.length) {
      const {resolved, rejected} = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
    // return dispatchRequest(config);
  }

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
