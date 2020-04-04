/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */

import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123

axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers: {
    test: '321'
  }
}).then((res) => {
  console.log(res.data)
})


axios({
  // 处理请求参数。只适用于put，post和patch
  transformRequest: [
    (function(data) {
      return data;
    }),
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  // 处理响应参数
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    console.error("error ::: ", data, axios.defaults.transformResponse);
    return data
  }],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
})
