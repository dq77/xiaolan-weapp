/**
 * 此方法用来判断获取当前项目运行的环境以及渠道
 * 当前的渠道分为：
 * H5: 京东白条渠道、支付宝生活号渠道  process.env.TARO_ENV === 'h5'
 * 小程序: 支付宝小程序、微信小程序  process.env.TARO_ENV === 'weapp'  process.env.TARO_ENV === 'alipay'
 * 3  支付宝生活号  ALIPAY_LIFE
 * 4  支付宝小程序  APLIPAY_MINI_PROGRAM
 * 5  APP  APP
 * 6  BLUEAIR  BLUEAIR
 * 7  钉钉  DingDing
 * 8  微信分销  FenXiao
 * 9  花呗  HuaBei
 * 10  京东白条  JDBT
 * 11  北美  USA
 * 12  微信小程序  XIAO_LAN
 */

export default function getChannel() {
  switch (process.env.TARO_ENV) {
    case 'h5':
      let host = window.location.host
      if (host === 'jd.taozugong.com' || host === 'jd.taozugong.cn' || host === 'm.taozugong.com') {
        return 'JDBT'
      } else if (host === 'alipay.taozugong.com' || host === 'alipay.taozugong.cn') {
        return 'ALIPAY_LIFE'
      } else {
        return 'ALIPAY_LIFE'
      }
    case 'weapp':
      return 'XIAO_LAN' // 微信小程序
    case 'alipay':
      return 'APLIPAY_MINI_PROGRAM' // 支付宝小程序
    default:
      return 'ALIPAY_LIFE'
  }

  if (process.env.TARO_ENV === 'h5') {
  } else if (process.env.TARO_ENV === 'alipay') {
  }
}
