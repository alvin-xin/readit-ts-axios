/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
import { RejectedFn, ResolvedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>,
  rejected?: RejectedFn
}

// 定义一个InterceptorManage泛型类，内部维护了一个私有属性interceptors数组，用来存储拦截器
// use接口用于添加拦截器到interceptors， 返回一个id用于拦截器删除拦截器
// forEach接口遍历interceptors用，仅支持传入一个函数， 遍历的过程中会传入每个interceptor作为参数传入调用这个函数
// eject就是通过传入一个拦截器的id删除interceptors中的某个拦截器
export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  // 拦截器管理 构造器
  constructor() {
    this.interceptors = [];
  }

  // 添加拦截器
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved, rejected
    })
    return this.interceptors.length - 1;
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if(interceptor !== null) {
        fn(interceptor);
      }
    })
  }

  // 删除某个拦截器
  eject(id: number): void {
    if(this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
