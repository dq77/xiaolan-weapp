/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:00
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:52:00
 */ 
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane, AtBadge, AtCurtain, AtList, AtListItem, AtModal } from 'taro-ui'
import noneImag from '@/images/orderlist/noneOrder.png'
import { get as getGlobalData } from '@/global_data'
import {
  payform_h5,
  payOrderMoney_signing,
  withoutCodePay,
  alipayLife_h5,
  preAuthorization
} from '@/components/payMoney/index'
// import * as orderApi from './service'
import OrderGood from './orderInfo'
import { cnzzTrackEvent } from '@/utils/cnzz'
import { serviecUrl } from '@/config/index'
import './index.scss'
import { WeChatPay } from '@/components/payMoney';

@connect(({ orderList }) => ({
  ...orderList
}))
export default class Test extends Taro.Component {
  config = {
    navigationBarTitleText: '订单列表',
    enablePullDownRefresh: this.state.isPull
  }

  constructor() {
    super(...arguments)
    this.state = {
      current: 0, // tab切换索引
      tabs: [{ title: '全部' }, { title: '待支付' }, { title: '待发货' }, { title: '待收货' }],
      channel: getGlobalData('Channel'), // 渠道
      selectedOrderGood: [], // 选择的订单商品
      logistics: false, // 多个商品时选择单个商品查看物流
      isReGoods: false,
      orderNo: '',
      isTopay: false,
      callbackOrderNo: '',
      isPull: false, // 是否下拉刷新
    }
    this.listqury = {
      page: 1,
      pageSize: 10
    }
  }

  componentWillMount() {
    const current = this.$router.params.current
    if (current) {
      this.setState(
        {
          current: current * 1
        },
        () => {
          this.fetchorderList()
        }
      )
    } else {
      this.fetchorderList()
    }
  }

  // // 监听下拉刷新函数
  // onPullDownRefresh = () => {
  //   this.fetchorderList();
  // }

  componentDidMount() {}

  componentDidShow() {
    this.getorederunpaid()
    this.fetchorderList()
  }

  // 获取订单列表
  fetchorderList() {
    let params = {
      channel: this.state.channel,
      status: this.formartdata(this.state.current),
      ...this.listqury
    }
    Taro.showLoading({
      title: 'loading'
    })
    this.props.dispatch({
      type: 'orderList/fetchorderList',
      payload: params,
      callback: (list) => {
        if (list.length > 0) {
          this.setState({
            isPull: false
          })
        }
        Taro.hideLoading();
        Taro.stopPullDownRefresh();
      }
    })
  }

  // 获取待支付的订单数量
  getorederunpaid() {
    let params = {
      channel: this.state.channel
    }
    this.props.dispatch({
      type: 'orderList/getorederunpaid',
      payload: params
    })
  }

  handleClick = current => {
    this.setState(
      {
        current
      },
      () => {
        this.listqury = {
          page: 1,
          pageSize: 10
        }
        this.fetchorderList()
      }
    )
  }

  formartdata(current) {
    switch (String(current)) {
      case '0':
        return '0' // 全部
      case '1':
        return '10010' // 待支付
      case '2':
        return '10040' // 待发货
      case '3':
        return '10042' // 待收货
      case '4':
        return '10051' // 租赁中
    }
  }

  // 下拉刷新
  onRestData = () => {
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      this.onPullDownRefresh()
      return
    }
    this.fetchorderList()
  }

  onPullDownRefresh = () => {
    this.fetchorderList()
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1500)
  }

  // 上拉加载更多
  onleadMore = () => {
    if (!this.props.isLast) {
      this.listqury.page++
      this.fetchorderList()
    }
  }

  // 物流跟踪
  orderLogistics = params => {
    // 友盟埋点
    cnzzTrackEvent('订单列表页', '物流跟踪')
    this.props.dispatch({
      type: 'orderList/getexpressinfo',
      payload: { ...params },
      callback: res => {
        if (res.code === 200) {
          if (res.data.length === 0) {
            Taro.showToast({
              title: '暂无物流信息',
              icon: 'none'
            })
          } else if (res.data.length === 1) {
            Taro.navigateTo({
              url: `/packageB/pages/address/logistics/index?orderNo=${res.data[0]}`
            })
          } else if (res.data.length > 1) {
            this.setState({
              selectedOrderGood: res.data || [],
              logistics: true
            })
          }
        }
      }
    })
  }

  // 前往物流页面
  navToLogistics(expressCode) {
    // 友盟埋点
    cnzzTrackEvent('订单列表页', '前往物流页面')
    Taro.navigateTo({
      url: `/packageA/pages/address/logistics/index?orderNo=${expressCode}`
    })
  }

  // 关闭商品选择弹窗
  onlogisticsClose = () => {
    this.setState({
      logistics: false
    })
  }

  // 确认收货 --取消
  handleReGoodsCancel = () => {
    this.setState({ isReGoods: false })
  }

  // 确认收货 --确认
  handleReGoodsConfirm = () => {
    this.setState(
      {
        isReGoods: false
      },
      () => {
        this.recepit()
      }
    )
  }

  // 是否确认收货
  isReGoods = orderNo => {
    this.setState({
      orderNo,
      isReGoods: true
    })
  }

  // 收货
  recepit = () => {
    // 友盟埋点
    cnzzTrackEvent('订单列表页', '确认收货')
    let params = {
      orderNo: this.state.orderNo
    }

    this.props.dispatch({
      type: 'orderList/receiveGoods',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '收货成功',
            icon: 'success'
          }).then(() => {
            setTimeout(() => {
              this.fetchorderList()
              this.getorederunpaid()
            }, 1000)
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
    // this.fetchorderList()
  }

  // 支付
  payPrice = params => {
    // 友盟埋点
    cnzzTrackEvent('订单列表页', '确认支付')
    Taro.showLoading({
      title: '开始支付'
    })
    let siginUrl = ''
    let onepayUrl = ''
    if (getGlobalData('Channel') === 'JDBT') {
      siginUrl = `${serviecUrl}/pages/order/orderDetail/index` // 截取 url 问号前面字符
      onepayUrl = serviecUrl + '/pages/order/payResult/index'
    } else if (getGlobalData('Channel') === 'ALIPAY_LIFE') {
      siginUrl = `${serviecUrl}/#/pages/order/orderDetail/index` // 截取 url 问号前面字符
      onepayUrl = serviecUrl + '/#/pages/order/payResult/index'
    } else if (getGlobalData('Channel') === 'XIAO_LAN') {
      let length = Taro.getCurrentPages().length;
      siginUrl = serviecUrl + Taro.getCurrentPages()[length-1];
      onepayUrl = serviecUrl + '/packageB/pages/order/payResult/index'
    }
    const Url = params.payType * 1 === 1 ? onepayUrl : siginUrl // 根据支付方式设置不同的回调地址
    this.props.dispatch({
      type: 'orderList/payMoney',
      payload: { ...params, callbackUrl: Url },
      callback: res => {
        Taro.hideLoading()
        if (res && res.code === 0) {
          // 京东收银台支付
          payform_h5('https://h5pay.jd.com/jdpay/saveOrder', res.data)
        } else if (res && res.code === 10) {
          // 京东免密签约
          payOrderMoney_signing(res.data.requestUrl)
        } else if (res && res.code === 20) {
          // 京东免密代扣
          setTimeout(() => {
            this.setState({
              isTopay: true,
              callbackOrderNo: res.data.orderNo
            })
          }, 1500)
        } else if (res.code === 3) {
          // 支付宝收银台支付
          alipayLife_h5(res.data.body)
        } else if (res.code === 5) {
          WeChatPay(res.data) // 此处返回的和其他渠道不一样，没有body
        } else if (res.code === 12) {
          // 支付宝预授权支付
          preAuthorization(res.data.orderStr).then(
            () => {
              // 预授权成功
              Taro.showToast({ title: '预授权成功' }).then(() => {
                setTimeout(() => {
                  this.WithoutCodePaypay(res.data.orderNo)
                }, 1500)
              })
            },
            () => {
              // 预授权失败
              Taro.showToast({ title: '预授权失败,请稍后再试', icon: 'none' })
            }
          )
        }
      }
    })
  }

  // 京东免密支付
  WithoutCodePaypay(orderNo) {
    Taro.showLoading({ title: '开始支付' })
    withoutCodePay({ orderNo: orderNo })
      .then(res => {
        Taro.hideLoading()
        if (res.code === 200) {
          Taro.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Taro.navigateTo({
                url: `/packageB/pages/order/payResult/index?orderNo=${orderNo}`
              })
            }, 1000)
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Taro.navigateTo({
                url: `/packageB/pages/order/payResult/index?orderNo=${orderNo}&payStatus=false`
              })
            }, 2000)
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { tabData, isLast, unpidBadge } = this.props
    const { selectedOrderGood, logistics, isReGoods, isTopay } = this.state
    return (
      <View className='orderList'>
        {/* 待支付 徽标 */}
        <AtBadge dot={unpidBadge[0] && unpidBadge.length > 0 ? true : false} maxValue={99} className='badge_daizhifu' />
        <AtBadge dot={unpidBadge[1] && unpidBadge.length > 0 ? true : false} maxValue={99} className='badge_daifahuo' />
        <AtBadge
          dot={unpidBadge[2] && unpidBadge.length > 0 ? true : false}
          maxValue={99}
          className='badge_daishouhuo'
        />
        <AtBadge
          dot={unpidBadge[3] && unpidBadge.length > 0 ? true : false}
          maxValue={99}
          className='badge_zulingzhong'
        />
        <AtTabs
          // scroll
          current={this.state.current}
          animated={false} // 不开启切换动画 hack徽标问题
          swipeable={false} // h5 不建议开启手势滑动
          tabList={this.state.tabs}
          onClick={this.handleClick}
          onleadMore={this.onleadMore}
        >
          {this.state.tabs.map((item, index) => {
            return tabData && tabData.length > 0 ? (
              <AtTabsPane current={this.state.current} index={index} key={item}>
                <View className='scrollView'>
                  <OrderGood
                    goodData={tabData}
                    onleadMore={this.onleadMore}
                    onRestData={this.onRestData}
                    isLast={isLast}
                    onOrderLogistice={this.orderLogistics}
                    onIsReGoods={this.isReGoods}
                    onPayPrice={this.payPrice}
                  />
                </View>
              </AtTabsPane>
            ) : (
              <AtTabsPane current={this.state.current} index={index} key={item}>
                <View className='imgWrap'>
                  <Image src={noneImag} mode='aspectFit' />
                  <Text>还没有相关订单</Text>
                </View>
              </AtTabsPane>
            )
          })}
        </AtTabs>
        {/* 物流跟踪 */}
        <AtCurtain isOpened={logistics} onClose={this.onlogisticsClose}>
          <AtList>
            {selectedOrderGood.length > 1
              ? selectedOrderGood.map(option => {
                  return (
                    <AtListItem
                      title='物流编号'
                      note={option}
                      extraText='查看物流'
                      arrow='right'
                      key={option}
                      onClick={() => this.navToLogistics(option)}
                    />
                  )
                })
              : null}
          </AtList>
        </AtCurtain>
        {/* 确认收货 */}
        <AtModal
          isOpened={isReGoods}
          cancelText='取消'
          confirmText='确认'
          onCancel={() => this.handleReGoodsCancel()}
          onConfirm={() => this.handleReGoodsConfirm()}
          content='确认收货'
        />
        {/* 免密支付提示 */}
        <AtModal
          isOpened={isTopay}
          confirmText='确认支付'
          onConfirm={() => this.WithoutCodePaypay(this.state.callbackOrderNo)}
          closeOnClickOverlay={false}
          content='您已签约免密支付,是否立即支付'
        />
      </View>
    )
  }
}
