/**
 *
 * H5页面埋点
 * 使用方法: 引入此方法
 * category:  描述
 * action: 行为动作
 * 友盟支持H5埋点 不支持小程序埋点
 */
import { getChannel } from './channel'

// eslint-disable-next-line import/prefer-default-export
export function cnzzTrackEvent(category,action) {
  if(process.env.TARO_ENV==='weapp' || process.env.TARO_ENV==='alipay') return
  if (getChannel == 'JDBT') {
    //京东白条
    category = '京东白条' + category
  } else if (getChannel == 'ALIPAY_LIFE') {
    // 支付宝
    category = '支付宝' + category
  }
  window._czc.push(['_trackEvent', category, action])
}

