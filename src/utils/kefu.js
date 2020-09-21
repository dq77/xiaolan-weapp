import { serviecUrl } from '../config/index'
import getChannel from '../utils/channel'

export function ysfConfig(ysf) {
  return ysf.config({
    uid: '',
    name: '',
    email: '',
    mobile: '',
    success: function() {
      // 成功回调
      // ysf.open();
      window.location.href = ysf.url()
    },
    error: function() {
      // 错误回调
      // handle error
    }
  })
}

export function ysfGoods(ysf, goods) {
  let url = ''
  if (getChannel() === 'ALIPAY_LIFE') {
    url = `${serviecUrl}/#/pages/goods/index?no=${goods.no}`
  } else {
    url = `${serviecUrl}/pages/goods/index?no=${goods.no}`
  }
  return ysf.config({
    uid: '',
    name: '',
    email: '',
    mobile: '',
    success: function() {
      // 成功回调
      ysf.product({
        show: 1, // 1为打开， 其他参数为隐藏（包括非零元素）
        title: goods.name, // 商品详情页和订单详情商品数据字段不一样
        desc: goods.brief,
        picture: goods.pictureList[0],
        note: '商品详情',
        url: url,
        success: function() {
          // 成功回调

          window.location.href = ysf.url()
        },
        error: function() {
          // 错误回调
          // handle error
        }
      })
    },
    error: function() {
      // 错误回调
      // handle error
    }
  })
}
