import Taro, { Component } from '@tarojs/taro'
import { Image, View, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import PropTypes from 'prop-types'
import { cnzzTrackEvent } from '../../utils/cnzz'
import './index.scss'

export default class GoodsList extends Component {
  static propTypes = {
    goodListDatas: PropTypes.array
  }

  static defaultProps = {
    goodListDatas: []
  }

  handleClick(item) {
    // 友盟埋点
    cnzzTrackEvent('分类列表页', '商品点击')

    Taro.navigateTo({
      url: `/packageA/pages/goods/index?no=${item.no}`
    })
  }

  calculatePrice = (item) => {
    let showPrice = 0.01
    showPrice = (item.minPrice-item.deductibleAmount*0.01).toFixed(2)
    if (showPrice < 0.01) {
      showPrice = 0.01
    }
    return showPrice
  }

  render() {
    const { goodListDatas } = this.props
    return (
      <View className='goods-list'>
        {goodListDatas.map(item => (
          <View className='goods-list-item' key={item} onClick={this.handleClick.bind(this, item)}>
            <View className='good-img'>
              <Image src={item.headFigure} style="width: 100%; height: 100%;" mode='aspectFill' />
            </View>
            <View className='list-txt-block'>
              <View className='list-item-title'>
                <Text className='item-title-txt'>{item.name}</Text>
              </View>
              <View className='list-item-brief'>
                <Text className='item-brief-txt'>{item.brief}</Text>
              </View>

              <View className='list-item-tag'>
                {item.goodsLabel &&
                  item.goodsLabel.map((itemlabel, indexlabel) => (
                    <Text className='item-tag-txt' key={indexlabel}>
                      {itemlabel}
                    </Text>
                  ))}
              </View>
              <View className='list-item-price'>
                <View className='price'>¥ {item.minPrice}</View> {item.businessType === 0 ? `/${item.unit}` : ''}
                { item.deductibleAmount && (<Text className='deductible'>抵后:{this.calculatePrice(item)}</Text>)}
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
