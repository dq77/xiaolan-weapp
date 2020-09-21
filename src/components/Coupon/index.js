// 我的优惠券

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import overdue from '../../images/common/coupon/overdue.png'
import used from '../../images/common/coupon/used.png'
import { cnzzTrackEvent } from '../../utils/cnzz'
import { unitFilter } from '../../utils/utils'
import './index.scss'

export default class Mycoupon extends Component {
  componentDidMount = () => {}

  onNavtohome() {
    // 友盟
    cnzzTrackEvent('优惠券', '优惠券使用')
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  render() {
    const { type, data = {} } = this.props
    return (
      <View>
        {this.props.type === 1 ? (
          <View className='common-coupon'>
            <View className='at-row at-row__justify--between at-row__align--center'>
              <View className='at-col at-col-8'>
                <View className='discount-price'>
                  <Text className='symbol-money'>￥</Text>
                  <Text className='money'>{data.couponMoney}</Text>
                </View>
                <Text className='discount-type'>
                  首付满{data.spendMoney}减{data.couponMoney}元
                </Text>
                {data.validStartTime ? (
                  <View className='discount-time'>
                    <Text>有效期：</Text>
                    <Text>
                      {data.validStartTime}
                      {data.validStartTime && data.validEndTime ? '至' : null}
                      {data.validEndTime}
                    </Text>
                  </View>
                ) : (
                  <View className='discount-time'>
                    <Text>{data.couponTime}{unitFilter(data.couponTimeUnit)}后过期</Text>
                  </View>
                )}
              </View>
              <View className='at-col at-col-3'>
                <AtButton type='primary' size='small' className='use-coupon' onClick={this.onNavtohome}>
                  去使用
                </AtButton>
              </View>
            </View>
          </View>
        ) : null}
        {type === 2 && (
          <View className='common-coupon used'>
            <View className='at-row at-row__justify--between at-row__align--center'>
              <View className='at-col at-col-8'>
                <View className='discount-price'>
                  <Text className='symbol-money'>￥</Text>
                  <Text className='money'>{data.couponMoney}</Text>
                </View>
                <Text className='discount-type'>
                  首付满{data.spendMoney}减{data.couponMoney}元
                </Text>
                {data.validStartTime ? (
                  <View className='discount-time'>
                    <Text>有效期：</Text>
                    <Text>
                      {data.validStartTime}
                      {data.validStartTime && data.validEndTime ? '至' : null}
                      {data.validEndTime}
                    </Text>
                  </View>
                ) : (
                  <View className='discount-time'>
                    <Text>{data.couponTime}{unitFilter(data.couponTimeUnit)}后过期</Text>
                  </View>
                )}
              </View>
              <View className='at-col at-col-3'>
                <Image className='taro-img' src={used} />
              </View>
            </View>
          </View>
        )}
        {type === 3 && (
          <View className='common-coupon overdue'>
            <View className='at-row at-row__justify--between at-row__align--center'>
              <View className='at-col at-col-8'>
                <View className='discount-price'>
                  <Text className='symbol-money'>￥</Text>
                  <Text className='money'>{data.couponMoney}</Text>
                </View>
                <Text className='discount-type'>
                  首付满{data.spendMoney}减{data.couponMoney}元
                </Text>
                {data.validStartTime ? (
                  <View className='discount-time'>
                    <Text>有效期：</Text>
                    <Text>
                      {data.validStartTime}
                      {data.validStartTime && data.validEndTime ? '至' : null}
                      {data.validEndTime}
                    </Text>
                  </View>
                ) : (
                  <View className='discount-time'>
                    <Text>{data.couponTime}{unitFilter(data.couponTimeUnit)}后过期</Text>
                  </View>
                )}
              </View>
              <View className='at-col at-col-3'>
                <Image className='taro-img' src={overdue} />
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}
