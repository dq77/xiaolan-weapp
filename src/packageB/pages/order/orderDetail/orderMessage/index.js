import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import copy from 'copy-to-clipboard'
import './index.scss'
import { cnzzTrackEvent } from '@/utils/cnzz'
import propTypes from 'prop-types'
export default class Test extends Taro.Component {
  propTypes = {
    mesData: propTypes.object
  }
  defaultProps = {
    mesData: {}
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
        return '微信一次性'
    }
  }

  copyNo = val => {
    cnzzTrackEvent('订单详情页', '复制订单编号')
    wx.setClipboardData({
      data: val,
      usccess: (res) => {
        Taro.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  }

  render() {
    const { mesData = {} } = this.props
    return (
      <View className='orderMessage'>
        <View className='cell'>
          <Text className='cell_left'>订单编号</Text>
          <View className='cell_right'>
            {mesData.orderNo || ''}{' '}
            <Text
              className='copy'
              onClick={() => this.copyNo(mesData.orderNo)}
            >
              复制
            </Text>
          </View>
        </View>
        <View className='cell'>
          <Text className='cell_left'>下单时间</Text>
          <Text className='cell_right'>{mesData.createTime}</Text>
        </View>
        {// 待支付 已取消 不显示
        mesData.status !== 10010 || mesData.status !== 10100 ? (
          <View className='cell'>
            <Text className='cell_left'>支付方式</Text>
            <Text className='cell_right'>
              {this.formartPayChannel(mesData.payChannel)}
            </Text>
          </View>
        ) : null}
        <View className='cell'>
          <Text className='cell_left'>备注</Text>
          <Text className='cell_right ov'>{mesData.buyerRemark || ''}</Text>
        </View>
      </View>
    )
  }
}
