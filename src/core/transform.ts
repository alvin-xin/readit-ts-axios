/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
import { AxiosTransformer } from '../types'

// fns 代表一个或者多个转换函数，内部逻辑很简单，遍历 fns，执行这些转换函数，
// 并且把 data 和 headers 作为参数传入，每个转换函数返回的 data 会作为下一个转换函数的参数 data 传入
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if(!fns) {
    return data;
  }

  if(!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, headers);
  })

  return data;
}
