import Taro from '@tarojs/taro'
import { channelAccredit } from '../utils/accredit'
import { baseUrl, noConsole } from '../config'

import { getCookie, hasToken } from '../utils/save-token'

export default (options = { method: 'GET', data: {}, requestType: false, contentType: '' }) => {
  let Token
  if (hasToken('Token')) {
    Token = getCookie('Token')
  }
  if (!noConsole) {
    console.log(`${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(options.data)}`)
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      url: baseUrl + options.url,
      data: options.data,
      header: {
        'Content-Type': options.contentType || 'application/json',
        Authorization: Token ? Token : '' // 请求携带token
      },
      contentType: false,
      method: options.method.toUpperCase()
    }).then(res => {
      const { statusCode, data } = res
      if (statusCode >= 200 && statusCode < 300) {
        if (!noConsole) {
          console.error(
            `【报错时间:】 ${new Date().toLocaleString()}\n【报错API:】${options.url}\n【接口响应：】`,
            res.data
          )
        }
        if ((data.code === -1 || data.code > 200) && data.code !== 20021) {
          Taro.showToast({
            title: (res.data.subMsg || res.data.msg || res.data.code) + '',
            icon: 'none',
            mask: true
          })
        }
        // -110 token 失效登陆授权页
        if (data.code === -110) {
          channelAccredit()
        }
        resolve(data)
      } else {
        reject(data)
        throw new Error(`网络请求错误，状态码${statusCode}`)
      }
    })
  })

  // return
}
