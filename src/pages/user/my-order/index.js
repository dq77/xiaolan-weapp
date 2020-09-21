import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtBadge } from 'taro-ui'
import bePay from '@/images/user/be-pay.png'
import beRent from '@/images/user/be-rent.png'
import beShipped from '@/images/user/be-shipped.png'
import beReceived from '@/images/user/be-received.png'
import { cnzzTrackEvent } from '@/utils/cnzz'
import './index.scss'
import { hasUserState } from '@/utils/accredit';

@connect(({ user }) => ({
  ...user
}))
export default class MyOrder extends Component {
  state = {
    list: [
      {
        current: 1,
        image: `${bePay}`,
        value: '待支付',
        num: '0'
      },
      {
        current: 2,
        image: `${beShipped}`,
        num: '0',
        value: '待发货'
      },
      {
        current: 3,
        image: `${beReceived}`,
        num: '0',
        value: '待收货'
      },
      // {
      //   current: 4,
      //   image: `${beRent}`,
      //   num: '0',
      //   value: '租赁中'
      // },
      {
        current: 0,
        image: `${beRent}`,
        num: '',
        value: '全部订单'
      }
    ]
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.cornerMark != nextProps.cornerMark) {
      this.fortmartcornerMark(nextProps.cornerMark)
    }
  }

  componentDidMount = () => {
    this.fortmartcornerMark(this.props.cornerMark)
  }

  // 格式化角标数据
  fortmartcornerMark = cornerMark => {
    const newList = []
    this.state.list.map(item => {
      if (item.current === 1) {
        item.num = this.fortmartorderStatus(10010, cornerMark)
      } else if (item.current === 2) {
        item.num = this.fortmartorderStatus(10040, cornerMark)
      } else if (item.current === 3) {
        item.num = this.fortmartorderStatus(10042, cornerMark)
      } else if (item.current === 4) {
        item.num = this.fortmartorderStatus(10051, cornerMark)
      }
      newList.push(item)
    })

    this.setState({
      list: newList
    })
  }

  //
  fortmartorderStatus(status, cornerMark) {
    let num = ''
    cornerMark &&
      cornerMark.map(one => {
        if (one.status === status) {
          return (num = one.num)
        }
      })
    return num
  }

  // 前往订单列表页
  navToorder = current => {
    // 友盟埋点
    cnzzTrackEvent('我的', '前往订单列表页')
    hasUserState().then(
      (flag) => {
        if (flag) {
          Taro.navigateTo({
            url: `/packageB/pages/order/orderList/index?current=${current}`
          })
        }
      },
      () => {
        this.props.onAllFunction();
      }
    )
   
  }

  render() {
    return (
      <View className='my-order at-row at-row__justify--around at-row__align--center'>
        {this.state.list.map((item,index) => (
          <View className='order-type' key={index} onClick={() => this.navToorder(item.current)}>
            {item.num == 0 && (
              // <View className='order-img'>
              <Image className='no-tips order-img taro-img' src={item.image} mode='widthFix' />
              // </View>
            )}
            {item.num > 0 && (
              <AtBadge value={item.num}>
                <Image src={item.image} mode='widthFix' className='taro-img'/>
              </AtBadge>
            )}
            <Text className='order-word'>{item.value}</Text>
          </View>
        ))}
      </View>
    )
  }
}
