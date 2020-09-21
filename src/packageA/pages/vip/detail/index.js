import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import getChannel from '@/utils/channel.js'
import './index.scss'

@connect(({ vip }) => ({
  ...vip
}))
export default class Detail extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      detailList: [],
      page: 1,
      isLast: false
    }
  }
  config = {
    navigationBarTitleText: '积分详情'
  }
  componentDidMount = () => {
    this.getDetail()
  }
  getDetail = () => {
    this.props.dispatch({
      type: 'vip/getDetail',
      payload: {
        channel: getChannel(),
        platform: 'WECHAT_MINI_PROGRAM',
        page: this.state.page
      },
      callback: res => {
        if (res.code === 200) {
          this.setState({
            detailModal: true,
            detailList: [...this.state.detailList, ...res.data.list],
            isLast: res.data.page === res.data.totalPage
          })
        }
      }
    })
  }
  loadMoreDetail = () => {
    if (this.state.isLast) return
    this.setState({
      page: this.state.page + 1
    }, () => { this.getDetail() })
  }

  render() {
    const { detailList } = this.state
    return (
      <ScrollView scrollY onScrollToLower={this.loadMoreDetail} className='scroll-view vip-detail'>
          <View className='detail-table'>
            { detailList.map(item => (
              <View className='item'>
                <View className='left'>
                  <View className='cause'>{item.causeDesc}</View>
                  <View className='date'>{item.actionTime}</View>
                </View>
                <View className='right'>
                  <View className='point'>{item.changedPoint>0 ? '+':''}{item.changedPoint}</View>
                  <View className='result'>兰花豆：{item.resultPoint}</View>
                </View>
              </View>
            ))}
          </View>
      </ScrollView>
    )
  }
}
