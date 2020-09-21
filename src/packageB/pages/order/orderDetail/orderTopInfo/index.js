import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'

export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      bgImg: '',
      statusText: '',
      statusDetail: ''
    }
  }

  componentDidMount() {
    this.initBgimg(this.props.topData.status)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.topData.orderNo !== this.props.topData.orderNo ||
      nextProps.topData.status !== this.props.topData.status
    ) {
      
      this.initBgimg(nextProps.topData.status)
    }
  }

  initBgimg = status => {
    switch (String(status)) {
      case '10010':
        this.setState({
          bgImg: 'daizhifu',
          statusText: '待支付',
          statusDetail: '请尽快支付'
        })
        return // 待支付
      case '10041':
        this.setState({
          bgImg: 'daifahuo',
          statusText: '待发货',
          statusDetail: '我们将尽快为您发货'
        })
        return // 待发货
      case '10031':
        this.setState({
          bgImg: 'daifahuo',
          statusText: '待发货',
          statusDetail: '我们将尽快为您发货'
        })
        return 'daifahuo' // 待收货
      case '10042':
        this.setState({
          bgImg: 'daishouhuo',
          statusText: '待收货',
          statusDetail: '请确认收货'
        })
        return // 待收货
      case '10051':
        this.setState({
          bgImg: 'zulingzhong',
          statusText: '租赁中',
          statusDetail: '租赁到期后请联系客服寄回'
        })
        return // 租赁中
      case '10020':
        this.setState({
          bgImg: 'daishouhuo',
          statusText: '支付待确认',
          statusDetail: ''
        })
        return // 待确认
      case '10052':
        this.setState({
          bgImg: 'zulingzhong',
          statusText: '分期还款中',
          statusDetail: '请在账期前保证账户余额或绑定银行卡余额充足'
        })
        return //还款中
      case '10074':
        this.setState({
          bgImg: 'zulingzhong',
          statusText: '退款中',
          statusDetail: ''
        })
        return
      case '10090':
        this.setState({
          bgImg: 'zulingzhong',
          statusText: '退款成功',
          statusDetail: '已退款，具体以银行到账日期为准'
        })
        return
      case '10060':
        this.setState({
          bgImg: 'daishouhuo',
          statusText: '待归还',
          statusDetail: '请联系客服归还'
        })
        return // 待归还
      case '10065':
        this.setState({
          bgImg: 'guanbi',
          statusText: '已完成',
          statusDetail: '期待下次为您服务'
        })
        return // 已完成
      case '10100':
        this.setState({
          bgImg: 'guanbi',
          statusText: '已取消',
          statusDetail: ''
        })
        return //已取消
    }
  }

  render() {
    const { topData } = this.props
    
    return (
      <View className='orderTopInfo'>
        <View className={`orderStatus ${this.state.bgImg}`}>
          <Text className='orderStatus_status'>
            {this.state.statusText}
          </Text>
          <Text className='orderStatus_brief'>
            {this.state.statusDetail}
          </Text>
        </View>
        {topData && topData.tradeType === 'Buyout' ? null : (
          <View className='orderAddress'>
            <View className='orderAddress_user'>
              <AtIcon value='map-pin' size='16' color='#ccc'></AtIcon>
              <View className='orderAddress_user_name'>
                收货人：{topData.reciverName || '--'}{' '}
              </View>
              <View className='orderAddress_user_phone'>
                {topData.reciverMobile || '--'}
              </View>
            </View>
            <View className='orderAddress_ads'>
              {topData.reciverProvince || '--'}
              {topData.reciverCity || '--'}
              {topData.reciverDistrict || '--'}
              {topData.reciverDetailAddress || '--'}
            </View>
          </View>
        )}
      </View>
    )
  }
}
