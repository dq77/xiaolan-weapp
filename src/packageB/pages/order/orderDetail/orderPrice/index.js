import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text } from '@tarojs/components'
import CaseBack from '../../orderConfirm/cashBack/index'
import getChannel from '@/utils/channel'
import './index.scss'

@connect(({ orderDetail }) => ({
  ...orderDetail
}))
export default class Test extends Taro.Component {
  // 账期
  navTo = () => {
    const no = this.props.orderNo
    Taro.navigateTo({
      url: `/packageB/pages/order/orderBill/index?orderNo=${no}`
    })
  }
  // 查看订单的返现记录
  getReturnDetail() {
    this.props.dispatch({
      type: 'orderDetail/getReturnDetail',
      payload: {
        orderNo: this.props.priceData.orderNo
      }
    })
  }
  footerShow() {}
  render() {
    const { priceData, payBackData } = this.props
    const channel = getChannel()
    return (
      <View className='orderprice'>
        {priceData.totalDeposit && channel !== 'XIAO_LAN' ? (
          <View className='cell'>
            <Text className='cell_left'>总押金</Text>
            <Text className='cell_right'>¥ {priceData.totalDeposit}</Text>
          </View>
        ) : null}
        {priceData.freeDeposit && channel !== 'XIAO_LAN' ? (
          <View className='cell'>
            <Text className='cell_left'>减免押金</Text>
            <Text className='cell_right'>- ¥ {priceData.freeDeposit}</Text>
          </View>
        ) : null}
        {priceData.totalRent ? (
          <View className='cell'>
            <Text className='cell_left'>
              {priceData.tradeType === 'Buyout'
                ? '商品总价'
                : priceData.orderDetailVos[0].businessType
                ? '商品总价'
                : '总租金'}
            </Text>
            <Text className='cell_right'>¥{priceData.totalRent}</Text>
          </View>
        ) : null}
        {priceData.period && priceData.tradeType !== 'Sales' ? (
          <View className='cell'>
            <View className='cell_right'>
              <Text className='cell_left'>租期</Text>
            </View>
            <View className='cell_right'>
              <View>
                {priceData.period || '--'}
                {priceData.unit && priceData.unit === '月' ? '个' : ''}
                {priceData.unit}
              </View>
              {priceData.beginTime ? (
                <View>
                  {priceData.beginTime || '--'}-{priceData.endTime || '--'}
                </View>
              ) : null}
            </View>
          </View>
        ) : null}
        {priceData.tradeType !== 'Buyout' && priceData.tradeType !== 'Renewal' ? (
          <View className='cell'>
            <View className='cell_right'>
              <Text className='cell_left'>运费</Text>
            </View>
            <View className='cell_right'>
              <View>￥
                {priceData.freight}
              </View>
            </View>
          </View>
        ) : null}
        {priceData.discountFee ? (
          <View className='cell bt'>
            <Text className='cell_left'>优惠</Text>
            <Text className='cell_right blue'>-¥{priceData.discountFee}</Text>
          </View>
        ) : null}
        {/* 订单返现 */}
        {priceData && priceData.payBackPercent && (
          <CaseBack
            onFooterShow={this.footerShow}
            backPercent={priceData.payBackPercent}
            payBackMoney={priceData.payBackMoney}
            payBackData={payBackData}
            onGetReturnDetail={this.getReturnDetail.bind(this)}
          />
        )}
        <View className='cell bp'>
          <Text className='cell_left'>应付金额</Text>
          <Text className='cell_right blue'>¥{priceData.payableAmount}</Text>
        </View>
        {priceData.tradeType && priceData.tradeType !== 'Buyout' ? (
          channel === 'ALIPAY_LIFE' || channel === 'XIAO_LAN' ? null : (
            <View className='cell'>
              <Text className='cell_left'>应付押金</Text>
              <Text className='cell_right'>¥ {priceData.deposit || '0'}</Text>
            </View>
          )
        ) : null}
        {priceData.payType === 2 &&
        (priceData.status * 1 !== 10010 && priceData.status * 1 !== 10020 && priceData.status * 1 !== 10100) ? ( // 1一次性 2分期 10051待支付 10020 支付待确认 10100 已取消
          <View className='cell' onClick={this.navTo}>
            <Text className='cell_left'>账单</Text>
            <Text className='cell_right'>
              <Text>
                {priceData.paidCount || 0}/{priceData.billCount || 0}
              </Text>
              <View className='at-icon at-icon-chevron-right vgn' />
            </Text>
          </View>
        ) : null}
      </View>
    )
  }
}
