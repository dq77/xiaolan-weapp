import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

export default class Brand extends Component {
  static propTypes = {
    brandList: PropTypes.array
  }

  static defaultProps = {
    brandList: []
  }

  render() {
    const { brandList } = this.props
    brandList.length = 3
    return (
      <View className='brand'>
        {brandList.map(item => (
          <View className='brand-item' key={item}>
            <Image mode='scaleToFill' src={item.picture} />
            <View className='brand-item-info'>
              <Text>{item.name}</Text>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
