/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/CancelToken'

// 在 createInstance 工厂函数的内部，我们首先实例化了 Axios 实例 context，
// 接着创建instance 指向 Axios.prototype.request 方法，并绑定了上下文 context；
// 接着通过 extend 方法把 context 中的原型方法和实例方法全部拷贝到 instance 上，
// 这样就实现了一个混合对象：instance 本身是一个函数，
// 又拥有了 Axios 类的所有原型和实例属性，最终把这个 instance 返回。
// 由于这里 TypeScript 不能正确推断 instance 的类型，我们把它断言成 AxiosInstance 类型。
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 实例化Axios
  const context = new Axios(config)
  // 创建instance指向Axios.prototype.request方法，并绑定上下文
  const instance = Axios.prototype.request.bind(context);

  // 通过extend方法把context中的原型方法和实例方法全部拷贝到instance上。以达到实现混合对象的目的
  extend(instance, context);

  return instance as AxiosStatic;
}

// 传入默认的请求配置
const axios: AxiosStatic = createInstance(defaults);

axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}

// @ts-ignore
axios.CancelToken = CancelToken
// @ts-ignore
axios.Cancel = Cancel
axios.isCancel = isCancel


axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

// @ts-ignore
axios.Axios = Axios

export default axios
