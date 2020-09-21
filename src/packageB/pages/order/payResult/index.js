import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import CheckedIMG from '@/images/payresult/pay.png'
import FailImg from '@/images/payresult/fail.png'
import { cnzzTrackEvent } from '@/utils/cnzz'
import './index.scss'

@connect(({ payResult }) => ({
  ...payResult
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      payStatus:
        (this.$router.params.payStatus && this.$router.params.payStatus) ||
        false // TRUE 支付成功  false // 支付失败
    }
  }
  config = {
    navigationBarTitleText: '支付成功'
  }

  componentWillMount() {
    this.fetchInit()
  }
  componentDidShow() {
  }

  fetchInit() {
    let params = {
      orderNo: this.$router.params.orderNo
    }
    this.props.dispatch({
      type: 'payResult/getpayPrice',
      payload: params
    })
  }

  // 回到首页
  navTohome() {
    // 友盟埋点
    cnzzTrackEvent('支付结果页', '回到首页')
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  // 查看订单
  navTohOrderdetail() {
     // 友盟埋点
     cnzzTrackEvent('支付结果页', '查看订单')
    let orderNo = this.$router.params.orderNo
    Taro.navigateTo({
      url: `/packageB/pages/order/orderDetail/index?orderNo=${orderNo}`
    })
  }

  // 前往订单列表
  navToOrderlist() {
     // 友盟埋点
     cnzzTrackEvent('支付结果页', '完成按钮')
    Taro.navigateTo({
      url: '/packageB/pages/order/orderList/index'
    })
  }

  render() {
    const { payPrice } = this.props
    return (
      <View className='payResult'>
        <View className='imgwrap'>
          <Image
            src={!this.state.payStatus ? CheckedIMG : FailImg}
            mode='widthFix'
          />
        </View>
        {}
        <View className='success_text'>
          {!this.state.payStatus ? '支付成功' : '支付失败'}
        </View>
        <View className='success_price'>
          <Text>支付金额：</Text>
          <Text className='success_price_money'>¥{payPrice}</Text>
        </View>
        <View className='success_btn'>
          <AtButton onClick={this.navTohome}>回到首页</AtButton>
          <AtButton onClick={() => this.navTohOrderdetail()}>查看订单</AtButton>
        </View>
        <View className='success_ok'>
          <AtButton type='primary' onClick={this.navToOrderlist}>
            完成
          </AtButton>
        </View>
      </View>
    )
  }
}
