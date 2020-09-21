import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import getChannel from '@/utils/channel'

@connect(({ bill }) => ({
  ...bill
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {}
  }

  config = {
    navigationBarTitleText: '账期'
  }

  componentWillMount() {
    this.fetchBill()
  }

  componentDidMount() {}

  // 账期
  fetchBill() {
    let params = {
      orderNo: this.$router.params.orderNo
    }
    Taro.showLoading({
      title: 'loading'
    })
    this.props.dispatch({
      type: 'bill/getBill',
      payload: params,
      callback: () => {
        Taro.hideLoading()
      }
    })
  }

  //  扣款状态
  fortmartStatus(status) {
    let statusText = ''
    if (status * 1 === 0) {
      statusText = '已还款'
    } else if (status * 1 === 1 || status * 1 === 2) {
      statusText = '待扣款'
    } else if (status * 1 === 3) {
      statusText = '已关闭'
    }
    return statusText
  }

  render() {
    const { billData } = this.props
    return (
      <View className='orderBill'>
        <View className='bill_price'>
          <View className='cell bline'>
            <Text className='cell_left'>应付金额：</Text>
            <Text>¥{billData.totalAmount || 0}</Text>
          </View>
          {getChannel() !== 'ALIPAY_LIFE' ? (
            <View className='cell bline'>
              <Text>押金：</Text>
              <Text>¥{billData.depositAmount || 0}</Text>
            </View>
          ) : null}
        </View>
        <View className='bill_time'>
          {
            billData.bills && Array.isArray(billData.bills) ?
            (billData.bills.map( item =>{
              return (
                <View className='cell bline' key={item}>
                  <View className='cell_left'>
                    <Text>
                      第{item.dividedNum || '--'}期 ¥{item.payAmount || '--'}
                    </Text>
                    <Text className='textcolor'>{item.expectedTime ? item.expectedTime.substr(0, 10) : null}</Text>
                  </View>
                  <View className={item.status === 0 ? 'cell_right' : 'cell_right blue'}>
                    <Text>{this.fortmartStatus(item.status)}</Text>
                    {item.payTime ? (
                      <Text className='textcolor'>实际扣款时间：{item.payTime.substr(0, 10)}</Text>
                    ) : null}
                  </View>
                </View>
              )
            })
          ) : (
            <View>暂无账期</View>
          )}
        </View>
      </View>
    )
  }
}
