// 我的优惠券

import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import noCoupon from '../../images/common/coupon/no-coupon.png'

export default class NoCoupon extends Component {
  componentDidMount = () => {}

  render() {
    return (
      <View className='no-coupon'>
        <Image src={noCoupon} mode='widthFix' />
        <Text className='span'>还没有券哦</Text>
      </View>
    )
  }
}
