import Request from '@/utils/request';
import Request2 from '@/utils/request2';



/**
 * 获取手机验证码
 * @param {mobile, businessType} data
 */
export const getCode = data => Request({
  url: '/user/get_auth_code',
  method: 'POST',
  data,
  requestType: true
})

/**
 * 注册
 * @param {mobile, password,verification,channel='APP'} data
 */
export const register = data => Request({
  url: '/user/register',
  method: 'POST',
  data,
  requestType: true
})


/**
 * 账户登录
 * @param {mobile, password,channel='APP'} data
 */
export const login = data => Request({
  url: '/user/login',
  method: 'POST',
  data,
})
/**
 * 验证码登录
 * @param {mobile,verification,channel='APP'} data
 */
export const codeLogin = data => Request({
  url: '/user/login',
  method: 'POST',
  data,
})

/**
 * 拿用户信息
 */
export const getUserInfo = data => Request({
  url: '/get_user_info',
  method: 'get',
  data,
})

export const weChatGetUserInfo = data => Request({
  url: '/v1/users/weChat/XIAO_LAN',
  method: 'POST',
  data: data
})

// /**
//  * 修改密码
//  * @param {mobile,newPassword,verification} data
//  */
// export const  editPassword = data => Request({
//   url:'/modify_password',
//   method:'POST',
//   data
// })


/**
 * 修改个人资料
 * @param {age,city,province,sex,username} data
 */
export const infoEdit = data => Request({
  url: '/update_user_info',
  method: 'POST',
  data,
})


/**
 * upload 头像
 * @param {file} data
 */
export const fuck = data => Request2({
  url: '/upload_pic',
  method: 'POST',
  data,
})

/**
 * editPassword 修改密码
 * @param
 * "mobile": "string",
  "newPassword": "string",
  "verification": "string"
 */
export const editPassword = data => Request({
  url: '/find_password',
  method: 'POST',
  data,
})

/**
 * getMyCoupon 我的优惠券
 * @param
channel:'APP'
 */
export const getMyCoupon = data => Request({
  url: `/user_coupon/my_coupons/${data.channel}/${data.status}`,
  method: 'get',
  data,
})


// 京东手机号绑定
export const jdBindPhone = data => Request({
  url: '/user/jd/bind',
  method: 'get',
  data,
})

// 用户订单统计
export const getorederunpaid = data => Request({
  url: `/user_orders/${data.channel}/count`,
  method: 'GET',
  data,
})

// 提交意见
export const upAddidea = data => Request({
  url: `/upload_suggest`,
  method: 'POST',
  data,
})

// 意见反馈图片
export const uploadImg = data => Request({
  url: `/upload_suggest_pic`,
  method: 'POST',
  data,
})


// 上传头像
export const uploadHeadPortrait = data => Request({
  url: `//upload_pic`,
  method: 'POST',
  data,
})


// 支付宝手机号绑定
export const alipayBindPhone = data => Request({
  url: '/user/alipay/bind',
  method: 'get',
  data,
})

export const weChatBindPhone = data => Request({
  url: '/user/wechat/bind',
  method: 'GET',
  data: data
})


