import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import RadioSelect from '@/components/RadioSelect'
import Popup from '@/components/popup'
import { AtIcon } from 'taro-ui'
import './index.scss'

export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      couponShow: false,
      checkedValue: this.props.optimalCoupos && this.props.optimalCoupos.id || ''
    }
  }

 
  componentWillReceiveProps(nextProps) {
    if (this.props.optimalCoupos && this.props.optimalCoupos.id !== nextProps.optimalCoupos.id) {
      this.setState({
        checkedValue: nextProps.optimalCoupos.id
      })
    }
  }

  open = () => {
    this.setState({
      couponShow: true
    })
    this.props.onFooterShow(false)  // hack IOS 遮挡问题
  }

  // 浮窗关闭
  onHandleClose = () => {
    this.setState({
      couponShow: false
    })
    this.props.onFooterShow(true)  //  hack IOS 遮挡问题
  }

  // 选择优惠券
  handleOk = value => {
    let couponMoney = ''
    let couponId = ''
    let discountType = ''
    this.props.radioCouponsData.map(item => {
      if (item.value === value) {
        couponMoney = item.couponMoney
        couponId = item.value
        discountType = item.discountType
        return
      }
    })
    this.setState(
      {
        checkedValue: value
      },
      () => {
        this.onHandleClose()
      }
    )
    this.props.onSelectCoupons(couponMoney, couponId, discountType)
  }

  // 格式化value
  formartValue(val) {
    let couponMoney = '';
    this.props.radioCouponsData.map(item => {
      if (item.value === val) {
        if (item.value === -1) {
          couponMoney = '不使用'
        } else {
          couponMoney = '-¥'+item.couponMoney
        }
      }
    })
    return couponMoney
  }

  render() {
    const { hasCoupons, radioCouponsData } = this.props
    return (
      <View className='coupons'>
        <View className='coupon-container'>
          <Text>优惠券</Text>
          {hasCoupons ? (
            <View className='coupons_status' onClick={this.open}>
              <Text>{this.formartValue(this.state.checkedValue)}</Text>
              {/* <View className='at-icon at-icon-chevron-right vgn' /> */}
              <AtIcon value='chevron-right' size='15' color='#ccc'></AtIcon>
            </View>
          ) : (
            <View className='coupons_status'>
              <Text>无可用优惠券</Text>
            </View>
          )}
        </View>
        {
        this.state.couponShow && <RadioSelect
          show={this.state.couponShow}
          title='选择优惠券'
          checkedValue={this.state.checkedValue}
          radioData={radioCouponsData}
          onHandleOk={this.handleOk}
          onHandleClose={this.onHandleClose}
          noOpertion
        />
        }
      </View>
    )
  }
}
