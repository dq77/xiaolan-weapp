import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class GoodsInfo extends Component {
  static defaultProps = {
    list: []
  }

  state = {
    
  }

  handleChange = () => {
    
  }

  render () {
    const { title,brief} = this.props;
    return (
      <View className='item-info'>
        <View className='item-info-title'>
          <Text>{title}</Text>
        </View>
        <View className='item-info-brief'>
          <Text>{brief}</Text>
        </View>
      </View>
    )
  }
}
