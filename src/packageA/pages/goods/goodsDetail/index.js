import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import propTypes from 'prop-types'
import './index.scss'

export default class GoodsDetail extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      current: 0
    }
  }
  static propTypes = {
    data: propTypes.object
  }
  static defaultProps = {
    list: [],
    data: () => {}
  }

  state = {}

  handleChange = () => {}

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  render() {
    const tabList = [{ title: '商品介绍' }, { title: '规格详情' }, { title: '售后说明' }]
    const { data } = this.props
    const { parameterList = [], detail = [], afterSaleList = [] } = data
    return (
      <View className='goods-detail'>
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
          className={this.props.isfixed ? 'titleFixed' : ''}
        >
          <AtTabsPane current={this.state.current} index={0} className='tab-name'>
            {/* <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >租赁概述</View> */}
            <View className={`detail-content, ${this.props.isfixed ? 'margin-top' : ''}`}>
              {detail.map(item => (
                <Image mode='widthFix' src={item} key={item} />
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} className='tab-name'>
            <View className='detail-content'>
              {parameterList.map(item => (
                <Image mode='widthFix' src={item} key={item} />
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2} className='tab-name'>
            <View className='detail-content'>
              <Image src='https://assets.taozugong.com/common/images/after_sale.png' mode='widthFix' key='after_sale' />
              {/* <Image src={afterSaleList[0]} mode='widthFix'/> */}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
