/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-27
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-27
 */

const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 对FormData、ArrayBuffer类型判断时，isObject也会是true
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

// 只有普通的JSON对象才能满足这个条件
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

// 把from里的属性都扩展到to中，包括原型链上的属性
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}


export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

export function isFormData(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
