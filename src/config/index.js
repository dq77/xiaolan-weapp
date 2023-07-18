/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-04-22 14:59:23
 * @LastEditors: diaoqi
 * @LastEditTime: 2020-06-18 12:11:04
 */

/**
//  * 测试服务启地址  https://api.meijiji.cn/api   (http://101.37.150.73:8080)
 */

 // 可切换不同的请求地址（仅开发环境下生效）
const baseUrlPrefix = 'https://api.meijiji.cn'
// let baseUrlPrefix = 'https://service.meijiji.com'


export const baseUrl = process.env.NODE_ENV === 'production' ? 'https://service.meijiji.com' : baseUrlPrefix
export const serviecUrl = 'https://jd.meijiji.com' // 正式环境地址

// export const imgUploadUrl = 'https://api.meijiji.cn' // 图片上传地址
// export const imgUploadUrl = 'http://47.98.113.37:8080' // 图片上传地址
export const imgUploadUrl = 'https://service.meijiji.com' // 图片上传地址

export const jdAuthorizationUrl = 'http://opencredit.jd.com/oauth2/bind?merchantCode=73024369' // 京东权益授权页面地址

export const alipayLifeAuthorizationUrl =
  'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017091208699638&scope=auth_user' // 支付宝授权页面地址
// 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017082808426743&scope=auth_user' // 支付宝授权页面测试地址

// 输出日志信息
export const noConsole = true
