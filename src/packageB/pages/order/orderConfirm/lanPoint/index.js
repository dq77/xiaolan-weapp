import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import RadioSelect from '@/components/RadioSelect'
import './index.scss'

class Index extends PureComponent {
  state = {
    title: '兰花豆',
    Show: false
  }

  onHandlePayClose = () => {
    this.setState({
      Show: false
    })
    this.props.onFooterShow(true)
  }

  openCaseback = () => {
    this.props.changeUse()
  }
  render() {
    const { title } = this.state
    const { availablePoint, usePoint, payBackMoney, payBackData } = this.props
    return (
      <View className='lan-point'>
        <Text>兰花豆</Text>
        <View className='right_node' onClick={this.openCaseback}>
          <View className='right_Text'>
          <Text>{availablePoint}兰花豆抵扣{availablePoint*0.01}元</Text>
          <View className={`use-point ${usePoint}`}></View>
          </View>
        </View>
      </View>
    )
  }
}
export default Index
