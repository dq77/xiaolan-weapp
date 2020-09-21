import Request from '../utils/request'

// 京东签约授权
export const fetchjdaccredit = data =>
  Request({
    url: `/user/jd/addUserInfo`,
    method: 'GET',
    data
  })

// 支付宝签约授权
export const fetchaliaccredit = data =>
  Request({
    url: '/user/alipay/addUserInfo',
    method: 'GET',
    data
  })

// 小程序授权
export const fetchappminiaccredit = data =>
  Request({
    url: `/v1/users/weChat/XIAO_LAN/${data.authCode}`,
    method: 'GET',
    data
  })

// 判断token 是否过期
export const fetchTokenisUseless = data =>
Request({
  url: '/token_is_useless',
  method: 'GET',
  data
})
