import Taro from '@tarojs/taro'
import { serviecUrl, jdAuthorizationUrl, alipayLifeAuthorizationUrl } from '../config/index'
import { setCookie, getCookie, hasToken, getSessionItem } from './save-token'
import { fetchjdaccredit, fetchaliaccredit, fetchappminiaccredit } from '../api/accredit'
import getChannel from './channel'

const filterUrlArr =
  getChannel() === 'JDBT'
    ? ['/pages/home/index', '/pages/user/index', '/']
    : ['#/pages/home/index', '#/pages/user/index', '/']

// 不同渠道走不同的授权流程
export function channelAccredit() {
  return new Promise((resolve, reject) => {
    
    switch (getChannel()) {
      case 'JDBT':
        jdAccredit()
        break
      case 'ALIPAY_LIFE':
        getUsersUID()
        break
      case 'APLIPAY_MINI_PROGRAM':
        alipayAppauth()
        break
      case 'XIAO_LAN':
        appMiniCheckSession().then((res) => {
          resolve(false)
        })
        break
      default:
        break
    }
  })
}

//获取url?后面参数
export function GetRequest(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg) //search,查询？后面的参数，并匹配正则
  if (r != null) return unescape(r[2])
  return null
}

export function aliGetrequest(name) {
  let index = window.location.hash.substr(1).indexOf('?')
  if (index) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.hash
      .substr(1)
      .substr(index + 1)
      .match(reg)
    if (r != null) return r[2]
    return null
  }
}

export function applicationAccredit() {
  // 不同页面走不同的授权操作
  switch (getChannel()) {
    case 'JDBT': // 京东白条信用
      navToJDAccredit().then(
        () => {
          jdAccredit()
        },
        () => {}
      )
      break
    case 'ALIPAY_LIFE': // 支付宝生活号
      handleAuth_code().then(
        () => {
          getUsersUID()
        },
        () => {}
      )
      break
    case 'XIAO_LAN':
      appMiniLogin();
      return;
    default:
      break
  }
}
// 授权  手机号绑定流程处理
export function hasUserState() {
  // if(getChannel() === 'XIAO_LAN') return true
  // 第一步 判断cookie是拥有openid accessToken  无 ====> 前往权益授权  有=======> 判断cookie 是否拥有Token
  return new Promise((resolve, reject) => {
    if (!hasToken('openid')) {
      setCookie('loginStatus', false)
      Taro.showLoading({
        title: '登录中'
      })
      channelAccredit().then((res) => {
        reject(res);
      })
      // return false
    } else {
      // console.log('微信小程序授权判断');
      if (!hasToken('Token') && hasToken('openid')) {
        Taro.navigateTo({
          url: '/pages/user/bindUserMobileLogin/index'
        })
        // resolve(false);
      } else {
        resolve(true)
      }
    }
  })
}

// <==========================我是可爱的分割线😊==================================>
/**
 * 京东授权流程
 */

// 处理accessToken
export function navToJDAccredit() {
  return new Promise((resolve, reject) => {
    let accessToken = GetRequest('accessToken')
    accessToken && setCookie('accessToken', accessToken)
    if (accessToken && !hasToken('openid') && !hasToken('Token')) {
      // 应用第一次加载
      resolve()
    } else {
      reject()
    }
  })
}

// 京东权益授权
export function jdAccredit() {
  // 是否拥有accessToken 如果cookie没有 则需要前往中间页重新登录
  if (hasToken('accessToken')) {
    let accessToken = getCookie('accessToken')
    fetchjdaccredit({ accessToken }).then(res => {
      if (res.code === 200) {
        if (res.data.token) {
          setCookie('Token', res.data.token)
        }
        // openid
        if (res.data.openid) {
          setCookie('openid', res.data.openid)
        } else if (res.data.jdUsers && res.data.jdUsers.openid) {
          setCookie('openid', res.data.jdUsers.openid)
        }
      } else {
        Taro.showToast({
          title: '京东授权失效,开始重新授权',
          icon: 'loading'
        }).then(() => {
          setTimeout(() => {
            const projectUrl = window.location.pathname
            let callBackUrl = ''
            if (filterUrlArr.includes(projectUrl)) {
              callBackUrl = serviecUrl + projectUrl
            } else {
              callBackUrl = window.location.href
            }
            window.location.href = `${jdAuthorizationUrl}&callBack=${encodeURIComponent(callBackUrl)}`
          }, 1000)
        })
      }
    })
  } else {
    Taro.showToast({
      title: '开始京东权益授权',
      icon: 'loading'
    }).then(() => {
      setTimeout(() => {
        const projectUrl = window.location.pathname
        let callBackUrl = ''
        if (filterUrlArr.includes(projectUrl)) {
          callBackUrl = serviecUrl + projectUrl
        } else {
          callBackUrl = window.location.href
        }
        window.location.href = `${jdAuthorizationUrl}&callBack=${encodeURIComponent(callBackUrl)}`
      }, 1000)
    })
  }
}

// <==========================我是可爱的分割线😊==================================>

/**
 * 支付宝授权流程
 * scope: auth_user auth_base
 * redirect_uri: 回调页面
 */

//  验证 url 是否携带 auth_code
export function handleAuth_code() {
  return new Promise((resolve, reject) => {
    let authCode = aliGetrequest('auth_code')
    authCode && setCookie('authCode', authCode)
    if (authCode && !hasToken('openid') && !hasToken('Token')) {
      resolve()
    } else {
      reject()
    }
  })
}

export function getUsersUID() {
  if (hasToken('authCode')) {
    let authCode = getCookie('authCode')
    fetchaliaccredit({ authCode }).then(res => {
      if (res.code === 200) {
        if (res.data.token) {
          setCookie('Token', res.data.token)
        }
        // openid
        if (res.data.openid) {
          setCookie('openid', res.data.openid)
        } else if (res.data.alipayUsers && res.data.alipayUsers.openid) {
          setCookie('openid', res.data.alipayUsers.openid)
        }
      } else {
        Taro.showToast({
          title: '用户授权失效,开始重新授权',
          icon: 'loading'
        }).then(() => {
          setTimeout(() => {
            const projectUrl = window.location.hash.split('?')[0]
            let callBackUrl = ''
            if (filterUrlArr.includes(projectUrl)) {
              callBackUrl = serviecUrl + '/' + projectUrl
            } else {
              callBackUrl = window.location.href
            }
            // return
            window.location.href = `${alipayLifeAuthorizationUrl}&redirect_uri=${encodeURIComponent(callBackUrl)}`
          }, 1000)
        })
      }
    })
  } else {
    Taro.showToast({
      title: '开始用户信息授权',
      icon: 'loading'
    }).then(() => {
      setTimeout(() => {
        const projectUrl = window.location.hash.split('?')[0]
        let callBackUrl = ''
        if (filterUrlArr.includes(projectUrl)) {
          callBackUrl = serviecUrl + '/' + projectUrl
        } else {
          callBackUrl = window.location.href
        }
        // return
        window.location.href = `${alipayLifeAuthorizationUrl}&redirect_uri=${encodeURIComponent(callBackUrl)}`
      }, 1000)
    })
  }
}

// <==========================我是可爱的分割线😊==================================>
/**
 * 微信小程序授权流程
 * 1 调用小程序登陆 api  Taro.login  获取登陆凭证 code()
 * 2 调用小程序 Taro.checkSession  检验登陆接口的的时效性  具体时间由微信端实现判断 失效 ==> 重新登陆
 * 3 通过凭证调用服务端后台接口 换取 openid  token
 * 4 兼容处理用户拒绝授权的情况

 */

// 微信小程序检验登陆状态
export function appMiniCheckSession() {
  return new Promise((resolve, reject) => {
    if (getCookie('openid')) {
      Taro.checkSession().then(
        () => {
          // 授权状态在线 ===> 无需重复登陆
          resolve(getCookie('openid'))
        },
        () => {
          // 授权状态失效 ===> 前往登陆
          appMiniLogin().then(
            (res)=> {
              resolve(res);
            }
          )
        }
      )
    } else {
      appMiniLogin().then((res) => {
        resolve(res);
      });
    }
  })
}

// 微信小程序登陆
export function appMiniLogin() {
  return new Promise((resolve, reject) => {
    Taro.login().then(
      (res) => {
        res.code && getAppMiniOpeId(res.code).then(
          (res) => {
            resolve(res)
          }
        );
      },
      () => {
        console.log('获取失败！');
      }
    )
    }
  )
}

// 跟服务端换取openid
export function getAppMiniOpeId(code) {
  return new Promise((resolve, reject) => {
    fetchappminiaccredit({ authCode: code }).then(res => {
      if (res.code === 200) {
        Taro.hideLoading();
        // console.error('openId', res);
        if (res.data.token) {
          setCookie('Token', res.data.token)
        }
        // openid
        if (res.data && res.data.openid) {
          setCookie('openid', res.data.openid)
        } else if (res.data.wxUserResponse && res.data.wxUserResponse.openid) {
          setCookie('openid', res.data.wxUserResponse.openid)
        }
        // sessionKey
        if (res.data && res.data.wxUserResponse) {
          setCookie('sessionKey', res.data.wxUserResponse.sessionKey)
        }
        resolve(getCookie('openid'));
        // console.log('获取openid回调', res);
      }
    })
  })
}

export function appMiniGetSetting() {
  Taro.getSetting().then(
    res => {
      console.log('用户成功授权')
    },
    res => {
      console.log('用户拒绝了授权')
    }
  )
}
// <==========================我是可爱的分割线😊==================================>
// 支付宝小程序登陆授权授权
export function alipayAppauth() {
  my.getAuthCode({
    scopes: ['auth_user'],
    success: res => {
      // my.alert({
      //   content: res.authCode
      // })
      if (res.authCode) {
        // getAppMiniOpeId(res.authCode)
        setCookie(
          'Token',
          'taozugongeyJhbGciOiJIUzUxMiJ9.eyJST0xFIjoiMTM5NjEiLCJ1aWQiOiIxMzk2MSIsImdlbnRUaW1lIjoxNTU5ODAyMzQ0NDU0LCJleHAiOjE1NjA2NjYzNDR9.EI-kWNMnz8pnWjD3BYuEkoGUfUqJ0gtdPsS3hVqPvurt6jP73fVBgP2BLb115cuXOykzoHoCQs06UgBx1WPiIw'
        )
        setCookie('openid', '2088612138133851')
      }
    }
  })
}
