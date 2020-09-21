import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class GoodsPrice extends Component {
  static defaultProps = {
    list: []
  }

  state = {}

  handleChange = () => {}

  calculatePrice = () => {
    let showPrice = 0.01
    showPrice = (this.props.minprice-this.props.deductibleAmount*0.01).toFixed(2)
    if (showPrice < 0.01) {
      showPrice = 0.01
    }
    return showPrice
  }

  render() {
    const { minprice, unit, goodsLabel = [], officialPrice, deductibleAmount, businessType } = this.props

    return (
      <View className='item-price'>
        <View className='item-price-labels'>
          {!!goodsLabel &&
            goodsLabel.map(item => (
              <Text key={item} className='label-item'>
                {' '}
                {item}{' '}
              </Text>
            ))}
        </View>
        <View className='item-price-value'>
          <Text className='price-symbol'>¥</Text>
          <Text>{minprice}</Text>
          {businessType === 0 ? <Text className='price-unit'>/{unit === 'MONTH' ? '月' : '天'}</Text> : ''}
          <Text style='font-size:12px;padding-left:5px;'>起</Text>
          { deductibleAmount && (<Text className='deductible'>抵后:{this.calculatePrice()}</Text>)}
          <Text className='official-price'>官网售价 ¥{officialPrice}</Text>
          {/* <Text style='font-size:14px;margin-left:8Px; color:#333'>¥100</Text> */}
        </View>
      </View>
    )
  }
}
