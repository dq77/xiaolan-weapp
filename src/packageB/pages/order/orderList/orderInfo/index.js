import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtButton, AtActivityIndicator } from 'taro-ui'
import { cnzzTrackEvent } from '@/utils/cnzz'
import './index.scss'

@connect(({ orderList }) => ({
  ...orderList
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {}
  }
  defaultProps = {
    goodData: []
  }
  componentDidMount() {}

  // 订单状态
  resultOrderStatus(status) {
    switch (String(status)) {
      case '10010':
        return '待支付'
      case '10041':
        return '待发货'
      case '10031':
        return '待发货'
      case '10042':
        return '待收货'
      case '10051':
        return '租赁中'
      case '10052':
        return '还款中'
      case '10074':
        return '退款中'
      case '10090':
        return '退款成功'
      case '10020':
        return '支付确认中'
      case '10060':
        return '待归还'
      case '10065':
        return '已完成'
      case '10100':
        return '已取消'
    }
  }

  formartPayChannel(type) {
    switch (type) {
      case 'JD_H5':
        return '京东支付'
      case 'SERVICE_WINDOW_ALIPAY':
        return '支付宝支付'
      case 'WXPAY':
        return '微信支付'
      case 'JD_PERIODIC':
        return '京东签约代扣'
      case 'ALIPAY_AUTH':
        return '支付宝预授权'
      case 'APPLET_WX':
        return '微信一次性支付'
    }
  }

  // 物流跟踪
  orderLogistics = (event, orderNo) => {
    event.stopPropagation()
    let params = {
      orderNo: orderNo
    }
    this.props.onOrderLogistice(params)
  }

  confirmreceipt(event, orderNo) {
    event.stopPropagation()
    this.props.onIsReGoods(orderNo)
  }

  // 支付
  payPrice = (event, orderNo, payType) => {
    event.stopPropagation()
    Taro.showToast({
      title: '开始支付',
      icon: 'loading'
    })
    let params = {
      orderNo,
      payType
    }
    this.props.onPayPrice(params)
  }

  // 前往订单详情页
  navTodetail(orderNo) {
    // 友盟埋点
    cnzzTrackEvent('订单列表页', '前往订单详情')
    Taro.navigateTo({
      url: `/packageB/pages/order/orderDetail/index?orderNo=${orderNo}`
    })
  }

  render() {
    const { goodData = [] } = this.props
    const {} = this.state
    return (
      <ScrollView
        scrollWithAnimation
        scrollY
        className='orderGoods'
        lowerThreshold='100'
        upperThreshold='100'
        onScrollToUpper={this.props.onRestData}
        onScrollToLower={this.props.onleadMore}
      >
        {goodData.map(item => {
          return (
            <View className='goods' key={item.orderNo} onClick={() => this.navTodetail(item.orderNo)}>
              <View className='goods_top'>
                <Text>{item.createTime} </Text>
                <Text className='rightText'>{this.resultOrderStatus(item.status) || '--'}</Text>
              </View>

              {item.ordersProductInfo.map(one => {
                return (
                  <View className='goods_center' key={one.orderNo}>
                    <View className='imgwrap'>
                      <Image src={one.cover || '--'} mode='widthFix' />
                    </View>
                    <View className={one.detail ? 'goods_center_right' : 'goods_center_right flexColumn'}>
                      <View className='goods_center_right_goodsname'>{one.name || '--'}</View>
                      {one.detail ? <View className='goods_center_right_brief'>{one.detail}</View> : null}
                      <View className='goods_center_right_info'>
                        <View className='goods_center_right_pric'>
                          <Text className='goods_center_right_pric_money'>¥{one.showPrice || '--'}</Text>
                        </View>
                        <View className='goods_center_right_pric_count'>× {one.count || '--'}</View>
                      </View>
                    </View>
                  </View>
                )
              })}

              <View className='goods_footer'>
                <View className='payChannel'>付款方式：{this.formartPayChannel(item.payChannel)}</View>
                {item.status === 10010 ? ( //  待支付
                  <View className='pay_btn' onClick={(e) => { e.stopPropagation()}}>
                    <AtButton
                      type='secondary'
                      size='small'
                      onClick={event => this.payPrice(event, item.orderNo, item.payType)}
                    >
                      去支付
                    </AtButton>
                  </View>
                ) : item.status === 10065 ? ( // 已完成
                  <View className='pay_btn' onClick={(e) => { e.stopPropagation()}}>
                    {item.tradeType === 'Buyout' || item.tradeType === 'Renewal' ? null : (
                      <AtButton size='small' onClick={event => this.orderLogistics(event, item.orderNo)}>
                        物流跟踪
                      </AtButton>
                    )}
                  </View>
                ) : item.status === 10041 || item.status === 10031 ? ( // 待发货
                  <View className='pay_btn' />
                ) : item.status === 10051 ? ( // 租赁中
                  <View className='pay_btn' />
                ) : item.status === 10020 ? ( // 待支付确认
                  <View className='pay_btn' onClick={(e) => { e.stopPropagation()}}>
                    <AtButton type='secondary' size='small' onClick={event => this.payPrice(event, item.orderNo)}>
                      去支付
                    </AtButton>
                  </View>
                ) : item.status === 10052 ? ( // 还款中
                  <View className='pay_btn' />
                ) : item.status === 10060 ? ( // 待归还
                  <View className='pay_btn' />
                ) : item.status === 10065 ? ( // 已完成
                  <View className='pay_btn' />
                ) : item.status === 10042 ? ( // 待收货
                  <View className='pay_btn' onClick={(e) => {e.stopPropagation()}}>
                    {item.tradeType === 'Buyout' || item.tradeType === 'Renewal' ? null : (
                      <AtButton className='at-button' size='small' onClick={event => this.orderLogistics(event, item.orderNo)}>
                        物流跟踪
                      </AtButton>
                    )}
                    <AtButton className='at-button' type='secondary' size='small' onClick={event => this.confirmreceipt(event, item.orderNo)}>
                      确认收货
                    </AtButton>
                  </View>
                ) : (
                  <View className='pay_btn' />
                )}
              </View>
            </View>
          )
        })}
        <View className='footer_text'>
          {this.props.isLast ? (
            goodData.length > 3 ? (
              <Text>到底了亲!</Text>
            ) : null
          ) : (
            <AtActivityIndicator content='加载中...' mode='center' />
          )}
        </View>
      </ScrollView>
    )
  }
}
