/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:00
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:49:58
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import CouponPop from '@/components/RadioSelect/index'
import noCoupon from '@/images/common/coupon/no-coupon.png'
import { get as getGlobalData } from '@/global_data' // 全局变量文件
import CouposnOption from './couposnOption'
import './index.scss'
import { hasUserState } from '@/utils/accredit';

@connect(({ goods }) => ({
  ...goods
}))
export default class GoodsAbout extends Component {
  static defaultProps = {
    list: [],
    couponsVisible: false,
    onfreightVisible: false,
    onAdd: () => {},
    onPopupShow: () => {},
    goodData: () => {}
  }

  state = {
    couponsVisible: false,
    onfreightVisible: false
  }

  componentWillMount() {}

  componentDidMount() {
    this.fetchcouponslist()
  }

  componentDidShow() {
    //
  }

  fetchcouponslist() {
    let params = {
      channel: getGlobalData('Channel'),
      spuNo: this.props.no
    }
    this.props.dispatch({
      type: 'goods/getGoodscoupons',
      payload: params
    })
  }

  // 优惠劵窗口开启
  onCouponsPopupShow = () => {
    this.fetchcouponslist()
    this.setState({
      couponsVisible: true
    })
  }

  // 优惠劵窗口关闭
  onHandleouponClose = () => {
    this.setState({
      couponsVisible: false
    })
  }

  // 领取优惠券
  onReceiveCoupons = val => {
    hasUserState().then(
      (flag) => {
        let params = {
          userCouponId: val
        }
        this.props.dispatch({
          type: 'goods/receiveCoupons',
          payload: params,
          callback: res => {
            if (res.code === 200) {
              Taro.showToast({
                title: '领取成功',
                icon: 'success',
                duration: 1000
              })
              this.fetchcouponslist()
            } else {
              Taro.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      },
      () => {
        this.fetchcouponslist()
      }
    )
  }

  // 运费窗口开启
  onfreightPoupShow = () => {
    this.setState({
      onfreightVisible: true
    })
  }

  // 运费关闭窗口
  onHandleonfreightClose = () => {
    this.setState({
      onfreightVisible: false
    })
  }

  render() {
    const { couponsList = [], goodData, selectedData } = this.props
    const { specificationVOList = [] } = goodData

    return (
      <View className='goods-about'>
        {specificationVOList.length !== 0 && (
          <View className='goods-about-item' onClick={this.props.onAdd}>
            <Text className='item-title'>规格</Text>
            {!!selectedData.specNoIdDetail ? (
              <Text className='item-value'>{selectedData.specNoIdDetail}</Text>
            ) : (
              <Text className='item-value'>请选择规格</Text>
            )}
            <View className='at-icon at-icon-chevron-right' />
          </View>
        )}
        {couponsList.length > 0 && (
          <View className='goods-about-item' onClick={this.onCouponsPopupShow}>
            <Text className='item-title'>优惠</Text>
            <Text className='item-value'>{couponsList.length > 0 ? '优惠券可领' : '暂无优惠券'}</Text>
            <View className='at-icon at-icon-chevron-right' />
          </View>
        )}
        <View className='goods-about-item' onClick={this.onfreightPoupShow}>
          <Text className='item-title'>运费</Text>
          <Text className='item-value'>部分地区包邮</Text>
          <View className='at-icon at-icon-chevron-right' />
        </View>
        <View className='goods-about-item'>
          <Text className='item-title'>说明</Text>
          <Text className='item-value'>7天无理由退货 | 48小时发货 | 假一赔十</Text>
          {/* <View className='at-icon at-icon-chevron-right'></View> */}
        </View>

        <CouponPop
          title='可领取优惠券'
          show={this.state.couponsVisible}
          onHandleClose={this.onHandleouponClose}
          noOpertion={false}
        >
          {couponsList.length > 0 ? (
            couponsList.map(item => {
              return <CouposnOption data={item} key={item.id} onReceiveCoupons={this.onReceiveCoupons} />
            })
          ) : (
            <View className='no-coupon'>
              <Image className='taro-img' src={noCoupon} />
              <Text className='text'>还没有券哦</Text>
            </View>
          )}
        </CouponPop>

        <CouponPop
          title='运费说明'
          show={this.state.onfreightVisible}
          onHandleClose={this.onHandleonfreightClose}
          noOpertion={false}
        >
          <View>·不配送地区包括：</View>
          <View> - 新疆、西藏、青海、宁夏等地区</View>
          <View>·运费详情：</View>
          <View> - 根据您的收件地址、选择商品及数量不同，收取0 - 30不等运费，具体以订单确认页为准</View>
        </CouponPop>
      </View>
    )
  }
}
