/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvedPromise {
  (reason?: Cancel): void
}

// 在CancelToken构造函数内部，实例化一个pending状态的Promise对象，然后用resolvePromise变量指向resolve函数
// 接着执行executor函数，传入一个cancel函数，在cancel函数内部会调用resolvePromise把Promise对象从pending状态转变成resolved状态
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  // new CancelToken(function executor(c) {
  //   cancel = c;
  // })
  constructor(executor: CancelExecutor) {
    let resolePromise: ResolvedPromise;
    // 实例化一个pending状态的Promise对象
    this.promise = new Promise<Cancel>(resolve => {
      resolePromise = resolve;
    })

    executor(message => {
      if(this.reason) {return}
      this.reason = new Cancel(message);
      resolePromise(this.reason)
    })
  }

  // 定义一个 cancel 变量实例化一个 CancelToken 类型的对象，然后在 executor 函数中，把 cancel 指向参数 c 这个取消函数。
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      // @ts-ignore
      token
    }
  }

  throwIfRequested(): void {
    // 如果this.reason已经存在，说明已经被使用过，直接抛出错误
    if (this.reason) {
      throw this.reason
    }
  }
}
