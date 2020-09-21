import Taro from '@tarojs/taro'
import { set as setItem, get as getItem, del as delItem} from '../global_data'

export function setCookie(name, value) {
  if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    Taro.setStorageSync(name, value)
  } else {
    var Days = 3
    var exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=' + '/'
  }
}

export function getCookie(name) {
  if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    return Taro.getStorageSync(name)
  } else {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)') //正则匹配
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2])
    } else {
      return null
    }
  }
}
export function hasToken(name) {
  var val = getCookie(name)
  if (!val) {
    return false
  } else if (val) {
    return true
  }
}
export function delCookie(name) {
  if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    Taro.removeStorageSync(name)
  } else {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = getCookie(name)
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=' + '/'
    }
  }
}
export function setSessionItem(name, value) {
  if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    setItem(name, value);
  } else {
    sessionStorage.setItem(name, value);
  }
}
 export function getSessionItem(name) {
   if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    return getItem(name);
   } else {
    return sessionStorage.getItem(name);
   }
 }
 export function delSessionItem(name) {
  if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    delItem(name)
  } else {
    sessionStorage.removeItem(name);
  }
 }
