import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from '../xhr'
import { buildURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import { floralwhite } from 'color-name'
import transform from './transform'
import { isAbsoluteURL } from '../helpers/util'
import { combinePaths } from 'typedoc/dist/lib/ts-internal'

/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 发送请求前检查一下配置的 cancelToken 是否已经使用过了，如果已经被用过则不用法请求，直接抛异常
  throwIfCancellationRequested(config);
  processConfig(config)
  return xhr(config).then(
    res => transformResponseData(res),
    e => {
    if (e && e.response) {
      e.response = transformResponseData(e.response)
    }
    return Promise.reject(e)
  })
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  // 处理header依赖data，所以请求body数据之前处理header
  config.headers = transformHeaders(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 对header对象进行扁平化处理
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if(baseURL && !isAbsoluteURL(url!)) {
    url = combinePaths(baseURL, url!)
  }
  return buildURL(url!, params, paramsSerializer)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
