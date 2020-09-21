import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {AtButton} from 'taro-ui'
import { unitFilter } from '../../../../../utils/utils'
import './index.scss'

export default class Test extends Taro.Component {


  // 优惠券领取回调父组件
  receiveCoupons =(id) =>{
    this.props.onReceiveCoupons(id)
  }

  render() {
    const { data = {} } = this.props
    return (
      <View className='couponsInfo'>
        {/* 41 未领取 40已领取 */}
        <View className={data.useStatus===41 ? 'common-coupon used':'common-coupon'}>
            <View className='coupop-item'>
                <View className='coupop-price'>
                    <View className='discount-price'>
                        <Text className='symbol-money'>￥</Text>
                        <Text className='money'>{data.couponMoney || 1000}</Text>
                    </View>
                    <Text className='discount-type'>首付满{data.spendMoney || 100}减{data.couponMoney || 100}元</Text>
                    {
                      data.validStartTime
                      ?
                        <View className='discount-time'>
                            <Text>有效期：</Text>
                            <Text>{data.validStartTime || 100}至{data.validEndTime || 100}</Text>
                        </View>
                      :
                      <View className='discount-time'>
                            <Text>{data.couponTime}{unitFilter(data.couponTimeUnit)}后过期</Text>
                        </View>
                    }
                </View>
                <View className='coupop-btn'>
                    {
                      data.useStatus ===41
                      ?
                        <View className='use-coupon'>已领取</View>
                      :
                        <AtButton type='primary' size='small' className='use-coupon' onClick={() =>this.receiveCoupons(data.id)}>立即领取</AtButton>
                    }
                </View>
            </View>
        </View>
      </View>
    );
  }
}
