import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import RadioSelect from '@/components/RadioSelect'
import { get as getGlobalData } from '@/global_data'
import './index.scss'
import propTypes from 'prop-types'
import { AtIcon } from 'taro-ui';

export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      payTyepShow: false, // 选择支付方式
      leaseTime: false, // 租期
      payData: [{ label: '微信一次性支付', value: '2' }, { label: '京东签约代扣', value : '10'}], //
      checkedPayType: '' //  支付方式 0:京东H5一次性支付 1:支付宝一次性支付 2:微信一次性支付 10:京东代扣 12:支付宝预授权
    }
  }
  propTypes = {
    GoodsInfoData: propTypes.object
  }
  defaultProps = {
    GoodsInfoData: {} // 商品默认值
  }
  componentWillMount() {
    this.channelType()
  }

  componentWillReceiveProps(nextProps) {}

  // 渠道支付处理
  channelType() {
    //  支付方式 0:京东H5一次性支付 1:支付宝一次性支付 2:微信一次性支付 10:京东代扣 12:支付宝预授权
    this.setState(
      {
        checkedPayType: this.props.payChannel
      },
      () => {
        this.props.onSelectpayType(this.state.checkedPayType)
      }
    )
  }

  // 支付方式确认的回调
  handlePayOk = value => {
    this.setState(
      {
        checkedPayType: value
      },
      () => {
        this.onHandlePayClose()
        this.props.onSelectpayType(this.state.checkedPayType)
      }
    )
  }

  // 选择支付方式
  openPayType = () => {
    this.setState({
      payTyepShow: true
    })
    this.props.onFooterShow(false)
  }

  // 租期展示
  openLease = () => {
    this.setState({
      leaseTime: true
    })
    this.props.onFooterShow(false)
  }

  // 支付方式关闭
  onHandlePayClose = () => {
    this.setState({
      payTyepShow: false
    })
    this.props.onFooterShow(true)
  }

  // 租期关闭
  onHandleLeaseClose = () => {
    this.setState({
      leaseTime: false
    })
    this.props.onFooterShow(true)
  }

  // 处理选中支付方式的名字
  formartValue(value) {
    if (value) {
      return this.state.payData.filter(item => {
        return item.value === value
      })[0].label
    } else {
      return ''
    }
  }

  priceFormart(GoodsInfoData) {
    if (GoodsInfoData.Buyout) {
      return GoodsInfoData.productInfo.showPrice * GoodsInfoData.productInfo.count + this.props.freight
    } else {
      return (this.props.totalRent - this.props.couponMoney - (this.props.usePoint?this.props.availablePoint*0.01:0) + this.props.freight).toFixed(2)
    }
  }

  render() {
    // const Channel = getGlobalData('Channel') // 当前的渠道 App 渠道才可以自由选择支付方式
    const { leaseData, couponMoney, GoodsInfoData = {}, firstPay } = this.props

    return (
      <View className='paySelect'>
        <View className='payType'>
          <Text>支付方式</Text>
          <View
            className='payType_value'
            // onClick={GoodsInfoData.relet ? this.openPayType : null}
          >
            <Text>{this.formartValue(this.state.checkedPayType)}</Text>
            {/* {GoodsInfoData.relet ? (
              <View className='at-icon at-icon-chevron-right vgn' />
            ) : null} */}
            {/* <RadioSelect
              show={this.state.payTyepShow}
              title='选择支付方式'
              checkedValue={this.state.checkedPayType}
              radioData={this.state.payData}
              onHandleOk={this.handlePayOk}
              onHandleClose={this.onHandlePayClose}
              noOpertion
            /> */}
          </View>
        </View>
        <View className='pay_price'>
          <Text>应付金额</Text>
          <Text>¥{this.priceFormart(GoodsInfoData)}</Text>
        </View>

        {(this.state.checkedPayType === '10' || this.state.checkedPayType === '12') &&
        GoodsInfoData.productInfo.unit === '月' ? (
          <View className='lease_detail'>
            <Text>分期详情</Text>
            <View className='lease_detail_right' onClick={this.openLease}>
              <View className='lease_detail_right_value'>
                {couponMoney || !!firstPay ? (
                  <Text className='lease_detail_right_value_text'>
                    首期:¥
                    {leaseData.length > 0 && leaseData[0].payAmount.toFixed(2)}
                  </Text>
                ) : null}
                <Text className='lease_detail_right_value_text'>
                  {couponMoney || !!firstPay ? '剩余:' : null}¥{leaseData[1] ? leaseData[1].payAmount : 0}x
                  {couponMoney || !!firstPay ? leaseData.length - 1 : leaseData.length}期
                </Text>
              </View>
              <AtIcon value='chevron-right' size='16' color='#ccc'/>
              <RadioSelect
                show={this.state.leaseTime}
                title='分期每月还款金额'
                onHandleClose={this.onHandleLeaseClose}
                noOpertion={false}
              >
                {leaseData.map((item, index) => {
                  return (
                    <View key={item.index} className='lease_list'>
                      <View>
                        <Text className='periods'>第{item.dividedNum}期</Text>
                        <Text>{item.expectedTime.substr(0, 11)}</Text>
                      </View>
                      <View className='firstlesate_price'>
                        <Text>¥ {item.payAmount.toFixed(2)}</Text>
                        {index === 0 && couponMoney ? (
                          <Text className='firstlesate_price_coupons'>已优惠 -¥{couponMoney}</Text>
                        ) : null}
                      </View>
                    </View>
                  )
                })}
              </RadioSelect>
            </View>
          </View>
        ) : null}
      </View>
    )
  }
}
