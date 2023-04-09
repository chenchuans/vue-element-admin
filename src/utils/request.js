import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  baseURL: 'http://123.56.23.78:80/jstime', // 线上环境
  // baseURL: 'http://jstime.durl.ga:4445/jstime', // 测试环境
  // baseURL: 'http://localhost:8080/jstime', // 本地环境
  timeout: 20000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    if (!config.url.includes('/user/login')) {
      const { id, token } = JSON.parse(localStorage.getItem('loginInfo') || '{}')
      config.headers['uuid'] = id
      config.headers['token'] = token
    }
    if (config.url.includes('/download')) {
      config.responseType = "arraybuffer" // arraybuffer是js中提供处理二进制的接口
      config.headers['responseType'] = 'arraybuffer'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.config.url.includes('/download')) {
      // 对于文件下载返回
      return response.data
    }
    const res = response.data
    const type = res.code === 200 ? 'success' : 'error'
    Message({
      message: res.message || 'Error',
      type,
      duration: 500
    })
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
