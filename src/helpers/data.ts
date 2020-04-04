/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-27
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-27
 */
import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  // 如果是普通的json对象
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 将string类型的data： "{"a":1,"b":2}"
// 转换成 json类型的data：
// {
//   a: 1,
//     b: 2
// }
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
