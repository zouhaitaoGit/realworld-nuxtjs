/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 请求拦截器
// 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
// 插件导出函数必须作为 default 成员
export default ({ store }) => {
  request.interceptors.request.use(function (config) {
    // 登录状态下请求头带token
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, function (error) {
    // 请求失败将进入此处
    return Promise.reject(error)
  })
}