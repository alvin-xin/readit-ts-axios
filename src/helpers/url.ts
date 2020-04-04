/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-27
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-27
 */

import { isDate, isPlainObject, isURLSearchParams } from './util'

/**
 * 特殊字符转换
 * @param val
 */
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 参数为数组： foo: ['bar', 'baz'] ===>>> foo[]=bar&foo[]=baz
 * 参数为对象： foo: {  bar: 'baz' } ===>>> foo=%7B%22bar%22:%22baz%22%7D  foo 后面拼接的是 {"bar":"baz"} encode 后的结果
 * 参数为Date： date: new Date() ===>>> date=2019-04-01T05:55:39.030Z
 * 参数为特殊字符： foo: '@:$, ' ===>>> foo=@:$+   空格会被转译成+
 * 空值忽略： {foo: 'bar', baz: null} ===>>> foo=bar
 * 丢弃 url 中的哈希标记：
 *    {url: '/base/get#hash', params: { foo: 'bar' }}   ===>>> /base/get?foo=bar
 * 保留 url 中已存在的参数：
 *    {url: '/base/get?foo=bar',params: {bar: 'baz'}} ===>>> /base/get?foo=bar&bar=baz
 *
 * @param url
 * @param params
 */
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
) {
  if (!params) {
    return url
  }

  let serializedParams
  if(serializedParams) {
    serializedParams = paramsSerializer!(params)
  } else if(isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    // 保存着一个个key=value格式的转译之后的字符串
    const parts: string[] = [];

    Object.keys(params).forEach((key) => {
      let val = params[key];
      // 对空值进行处理
      if(val === null || typeof val === 'undefined') {
        return;
      }

      // 对参数为数组进行处理
      // foo: ['bar', 'baz']   ===>>> foo[]=bar&foo[]=baz'
      let values: string[];
      if(Array.isArray(val)) {
        values = val;
        key += '[]';
      } else {
        values = [val];
      }

      values.forEach((val) => {
        // 对日期进行处理
        if(isDate(val)) {
          val = val.toISOString();
        }
        // 对对象类型进行处理
        else if(isPlainObject(val)) {
          val = JSON.stringify(val);
        }
        // 对参数进行特殊字符转译处理
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    serializedParams = parts.join('&')
  }


  if(serializedParams) {
    // 获取到hash之前的url参数, 同时丢弃url中的hash标签
    const markIndex = url.indexOf('#')
    if(markIndex !== -1) {
      url = url.slice(0, markIndex);
    }

  // 如果本身具备有query 参数，直接在其后进行追加，否则拼接字符串
  url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url;
}


interface URLOrigin {
  protocol: string
  host: string
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host  === currentOrigin.host)
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
