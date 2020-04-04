/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
import { deepMerge, isPlainObject } from './util'
import { Method } from '../types'

// 对header对象进行扁平化处理
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  // 执行 XMLHttpRequest.send 方法的时候把普通对象 data 转换成一个 JSON 字符串，但是我们请求header 的 Content-Type 是 text/plain;charset=UTF-8，导致了服务端接受到请求并不能正确解析请求 body 的数据
  // 把 data 转换成了 JSON 字符串，但是数据发送到服务端的时候，服务端并不能正常解析我们发送的数据，因为我们并没有给请求 header 设置正确的 Content-Type
  // 处理将data转换成json对象，数据发送到服务端无法正常解析的问题，
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

// 将字符串类型的header对象转换成json对象
// 原始类型数据（demo）：
// date: Fri, 05 Apr 2019 12:40:49 GMT
// etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"
// connection: keep-alive
// x-powered-by: Express
// content-length: 13
// content-type: application/json; charset=utf-8
// 转换后的json类型数据
// {
//   date: 'Fri, 05 Apr 2019 12:40:49 GMT'
//   etag: 'W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"',
//     connection: 'keep-alive',
//   'x-powered-by': 'Express',
//   'content-length': '13'
//   'content-type': 'application/json; charset=utf-8'
// }
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    let val = vals.join(':').trim()
    parsed[key] = val
  })

  return parsed
}

// 经过合并之后的配置是headers是一个复杂对象，多了common、post、get等属性
// 将复杂对象压缩成一级
// headers: {
//   Accept: 'application/json, text/plain, */*',
//     'Content-Type':'application/x-www-form-urlencoded'
// }
export function flattenHeaders(headers: any, method: Method) {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
